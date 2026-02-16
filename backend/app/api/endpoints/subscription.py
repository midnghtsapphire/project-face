"""
Project Face — Subscription & Stripe Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.endpoints.auth import get_current_user
from app.models.models import User, SubscriptionTier
from app.schemas.schemas import (
    CreateCheckoutRequest, CheckoutResponse, SubscriptionResponse
)
from app.services.stripe_service import (
    create_checkout_session, create_customer,
    get_subscription, cancel_subscription, handle_webhook
)

router = APIRouter(prefix="/subscription", tags=["Subscription"])


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    request: CreateCheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Stripe Checkout session for subscription."""
    # Ensure customer exists in Stripe
    if not current_user.stripe_customer_id:
        customer_id = await create_customer(
            current_user.email, current_user.full_name
        )
        current_user.stripe_customer_id = customer_id
        db.commit()

    result = await create_checkout_session(
        customer_email=current_user.email,
        price_id=request.price_id,
        success_url=request.success_url,
        cancel_url=request.cancel_url,
        customer_id=current_user.stripe_customer_id,
    )
    return CheckoutResponse(**result)


@router.get("/status", response_model=SubscriptionResponse)
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
):
    """Get current subscription status."""
    if current_user.stripe_subscription_id:
        sub = await get_subscription(current_user.stripe_subscription_id)
        if sub:
            return SubscriptionResponse(
                subscription_id=sub["id"],
                status=sub["status"],
                tier=current_user.subscription_tier.value,
                current_period_end=sub.get("current_period_end"),
            )

    return SubscriptionResponse(
        subscription_id=None,
        status="none",
        tier=current_user.subscription_tier.value,
        current_period_end=None,
    )


@router.post("/cancel")
async def cancel_sub(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel subscription at end of billing period."""
    if not current_user.stripe_subscription_id:
        raise HTTPException(status_code=400, detail="No active subscription")

    success = await cancel_subscription(current_user.stripe_subscription_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to cancel subscription")

    return {"message": "Subscription will be cancelled at end of billing period"}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = await handle_webhook(payload, sig_header)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid webhook")

    event_type = event.get("type", "")
    data = event.get("data", {})

    if event_type == "customer.subscription.created":
        customer_id = data.get("customer")
        sub_id = data.get("id")
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.stripe_subscription_id = sub_id
            user.subscription_tier = SubscriptionTier.PREMIUM
            db.commit()

    elif event_type == "customer.subscription.deleted":
        customer_id = data.get("customer")
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.stripe_subscription_id = None
            user.subscription_tier = SubscriptionTier.FREE
            db.commit()

    return {"received": True}
