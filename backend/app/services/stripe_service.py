"""
Project Face — Stripe Integration Service
Handles subscription management for premium features.
"""
from typing import Optional, Dict, Any
from app.core.config import settings

try:
    import stripe
    stripe.api_key = settings.STRIPE_SECRET_KEY
    STRIPE_AVAILABLE = bool(settings.STRIPE_SECRET_KEY)
except ImportError:
    STRIPE_AVAILABLE = False


async def create_checkout_session(
    customer_email: str,
    price_id: str,
    success_url: str,
    cancel_url: str,
    customer_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Create a Stripe Checkout session for subscription."""
    if not STRIPE_AVAILABLE:
        return {
            "checkout_url": f"{success_url}?demo=true",
            "session_id": "demo_session_id",
        }

    params = {
        "mode": "subscription",
        "payment_method_types": ["card"],
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": success_url + "?session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": cancel_url,
    }

    if customer_id:
        params["customer"] = customer_id
    else:
        params["customer_email"] = customer_email

    session = stripe.checkout.Session.create(**params)
    return {
        "checkout_url": session.url,
        "session_id": session.id,
    }


async def create_customer(email: str, name: Optional[str] = None) -> Optional[str]:
    """Create a Stripe customer."""
    if not STRIPE_AVAILABLE:
        return "demo_customer_id"

    customer = stripe.Customer.create(email=email, name=name)
    return customer.id


async def get_subscription(subscription_id: str) -> Optional[Dict[str, Any]]:
    """Get subscription details."""
    if not STRIPE_AVAILABLE:
        return {
            "id": "demo_sub_id",
            "status": "active",
            "current_period_end": None,
        }

    try:
        sub = stripe.Subscription.retrieve(subscription_id)
        return {
            "id": sub.id,
            "status": sub.status,
            "current_period_end": sub.current_period_end,
        }
    except Exception:
        return None


async def cancel_subscription(subscription_id: str) -> bool:
    """Cancel a subscription at period end."""
    if not STRIPE_AVAILABLE:
        return True

    try:
        stripe.Subscription.modify(
            subscription_id, cancel_at_period_end=True
        )
        return True
    except Exception:
        return False


async def handle_webhook(payload: bytes, sig_header: str) -> Dict[str, Any]:
    """Process Stripe webhook events."""
    if not STRIPE_AVAILABLE:
        return {"type": "demo", "handled": False}

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise ValueError("Invalid webhook signature")

    return {
        "type": event.type,
        "data": event.data.object,
        "handled": True,
    }
