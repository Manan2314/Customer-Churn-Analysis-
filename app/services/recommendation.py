
SEGMENT_NAMES = {
    0: "Occasional Customers",
    1: "VIP Customers",
    2: "Loyal Customers",
    3: "Regular Customers",
}

SEGMENT_DETAILS = {
    0: {
        "description": (
            "Low-value customers with very few purchases, low engagement, "
            "and a long time since their last purchase."
        ),
        "business_goal": "Re-engage and bring them back.",
        "strategy": (
            "Offer win-back discounts, reminder emails, and personalized "
            "product recommendations."
        ),
    },

    1: {
        "description": (
            "Highest-value customers with frequent purchases, high spending, "
            "and strong engagement."
        ),
        "business_goal": "Retain and reward.",
        "strategy": (
            "Provide exclusive loyalty rewards, VIP benefits, and early access "
            "to new collections."
        ),
    },

    2: {
        "description": (
            "Consistent customers with above-average spending and regular "
            "purchase behavior."
        ),
        "business_goal": "Convert them into VIP customers.",
        "strategy": (
            "Recommend premium products, bundles, and bonus loyalty points."
        ),
    },

    3: {
        "description": (
            "Average customers with moderate spending and regular shopping "
            "behavior."
        ),
        "business_goal": "Increase engagement and purchase frequency.",
        "strategy": (
            "Use personalized promotions, seasonal discounts, and cross-selling."
        ),
    },
}


def customer_value(customer: dict) -> str:

    total_spend = customer.get("Total_Spend", 0)
    total_orders = customer.get("Total_Orders", 0)

    if total_spend >= 50000 and total_orders >= 20:
        return "VIP"

    elif total_spend >= 35000 and total_orders >= 15:
        return "HIGH"

    elif total_spend >= 15000 and total_orders >= 8:
        return "MEDIUM"

    else:
        return "LOW"
    


def customer_engagement(customer: dict) -> str:
    app_sessions = customer.get("App_Sessions_Per_Month", 0)
    coupons_used = customer.get("Coupons_Used", 0)
    wishlist_items = customer.get("Wishlist_Items", 0)
    cart_abandonment_rate = customer.get("Cart_Abandonment_Rate", 0)

    engagement_score = 0

    # App Sessions
    if app_sessions >= 17:
        engagement_score += 3
    elif app_sessions >= 12:
        engagement_score += 2
    elif app_sessions >= 8:
        engagement_score += 1

    # Coupons
    if coupons_used >= 10:
        engagement_score += 2
    elif coupons_used >= 5:
        engagement_score += 1

    # Wishlist
    if wishlist_items >= 7:
        engagement_score += 3
    elif wishlist_items >= 5:
        engagement_score += 2
    elif wishlist_items >= 2:
        engagement_score += 1

    # Moderate cart abandonment = browsing behaviour
    if 30 <= cart_abandonment_rate <= 70:
        engagement_score += 1

    if engagement_score >= 6:
        return "HIGH"
    elif engagement_score >= 3:
        return "MEDIUM"
    else:
        return "LOW"
    

def customer_activity(customer: dict) -> str:
    days_since_last_purchase = customer.get("Days_Since_Last_Purchase", 0)
    average_orders_per_month = customer.get("Average_Orders_Per_Month", 0)

    activity_score = 0

    # Recent Purchase
    if days_since_last_purchase <= 15:
        activity_score += 3
    elif days_since_last_purchase <= 45:
        activity_score += 2
    elif days_since_last_purchase <= 90:
        activity_score += 1

    # Purchase Frequency
    if average_orders_per_month >= 2.0:
        activity_score += 3
    elif average_orders_per_month >= 1.0:
        activity_score += 2
    elif average_orders_per_month >= 0.5:
        activity_score += 1

    if activity_score >= 5:
     
       return "ACTIVE"
    elif activity_score >= 3:
        return "DORMANT"
    else:
        return "INACTIVE"

def calculate_purchase_intent(customer: dict) -> str:

    activity = customer_activity(customer)
    engagement = customer_engagement(customer)
    cart_abandonment = customer.get("Cart_Abandonment_Rate", 0)

    # Highest buying intent
    if (
        activity == "ACTIVE"
        and engagement == "HIGH"
        and cart_abandonment <= 30
    ):
        return "HIGH"

    # Highly engaged but not purchasing recently
    if (
        activity == "DORMANT"
        and engagement == "HIGH"
        and 30 <= cart_abandonment <= 70
    ):
        return "HIGH"

    # Regular customer with decent engagement
    if (
        activity == "ACTIVE"
        and engagement == "MEDIUM"
    ):
        return "MEDIUM"

    # Browses but purchases less often
    if (
        activity == "DORMANT"
        and engagement == "MEDIUM"
    ):
        return "MEDIUM"

    # Everything else
    return "LOW"

def customer_health(customer: dict) -> str:
    Return_Rate = customer.get("Return_Rate", 0)
    Support_Tickets = customer.get("Customer_Support_Tickets",0)
    
    health_score = 0
    if Return_Rate <= 15:
        health_score += 3
    elif Return_Rate <= 40:
        health_score += 2
    else:
        health_score += 1
    
    if Support_Tickets <= 5:
     health_score += 3
    elif Support_Tickets <= 15:
     health_score += 2
    else:
     health_score += 1

    if health_score >= 5:
     return "GOOD"
    elif health_score >= 3:
        return "MEDIUM"
    else:
        return "POOR"

    
def customer_priority(customer : dict, churn_probability: float)->str:
  value = customer_value(customer)
  activity = customer_activity(customer)

  if churn_probability >= 0.80  and value == "VIP":
      return "HIGH"
  elif churn_probability >= 0.60:
      return "HIGH"
  elif activity == "INACTIVE":
      return "MEDIUM"
  else:
      return "LOW"

def generate_recommendation(
    customer: dict,
    churn_probability: float,
    customer_segment: int,
):
    value = customer_value(customer)
    activity = customer_activity(customer)
    engagement = customer_engagement(customer)
    health = customer_health(customer)
    purchase_intent = calculate_purchase_intent(customer)
    priority = customer_priority(customer, churn_probability)

    segment = SEGMENT_NAMES.get(
        customer_segment,
        "Unknown Segment"
    )
    
    segment_details = SEGMENT_DETAILS.get(
    customer_segment,
    {
        "description": "Unknown customer segment.",
        "business_goal": "N/A",
        "strategy": "N/A",
    }
    )

    recommendations = []

    # =========================
    # Retention Strategy
    # =========================

    if churn_probability >= 0.80:

        if value == "VIP":
            recommendations.append(
                "Offer an exclusive loyalty reward with a personalized discount and early access to new collections."
            )

        elif value == "HIGH":
            recommendations.append(
                "Provide a personalized discount along with bonus loyalty points to encourage repeat purchases."
            )

        else:
            recommendations.append(
                "Launch an automated win-back campaign with a limited-time discount."
            )

    elif churn_probability >= 0.60:
        recommendations.append(
            "Send personalized email campaigns featuring relevant products and time-limited offers."
        )

    # =========================
    # Customer Value Strategy
    # =========================

    if value == "VIP":
        recommendations.append(
            "Reward loyalty with exclusive member benefits and early access to new arrivals."
        )

    elif value == "HIGH":
        recommendations.append(
            "Recommend premium products and bonus loyalty rewards."
        )

    elif value == "MEDIUM":
        recommendations.append(
            "Encourage higher spending through product bundles and seasonal offers."
        )

    else:
        recommendations.append(
            "Promote value-for-money products and introductory discounts."
        )

    # =========================
    # Engagement Strategy
    # =========================

    if activity == "INACTIVE":
        recommendations.append(
            "Launch a win-back campaign with personalized offers and product recommendations."
        )

    elif activity == "DORMANT":
        recommendations.append(
            "Remind the customer about wishlist items and recently viewed products."
        )

    if engagement == "HIGH":
        recommendations.append(
            "Recommend complementary products based on browsing and purchase history."
        )

    # =========================
    # Customer Experience Strategy
    # =========================

    if health == "POOR":
        recommendations.append(
            "Prioritize customer support and resolve service issues before promotional campaigns."
        )

    # =========================
    # Sales Strategy
    # =========================

    if purchase_intent == "HIGH":
        recommendations.append(
            "Offer personalized product bundles and checkout incentives."
        )

    elif purchase_intent == "MEDIUM":
        recommendations.append(
            "Highlight popular products and limited-time deals."
        )

    # =========================
    # Segment Strategy
    # =========================

    if segment == "VIP Customers":
        recommendations.append(
            "Provide exclusive member-only offers, early access to new collections, and premium loyalty rewards."
        )

    elif segment == "Loyal Customers":
        recommendations.append(
            "Increase repeat purchases through personalized product recommendations and bundle offers."
        )

    elif segment == "Regular Customers":
        recommendations.append(
            "Encourage higher engagement with seasonal promotions and personalized discounts."
        )

    elif segment == "Occasional Customers":
        recommendations.append(
            "Re-engage the customer with introductory offers and recommendations based on previously viewed products."
        )

    # =========================
    # Priority Strategy
    # =========================

    if priority == "HIGH":
        recommendations.append(
            "Mark this customer as a high-priority retention case for upcoming marketing campaigns."
        )

    # =========================
    # Default Recommendation
    # =========================

    if not recommendations:
        recommendations.append(
            "Maintain regular engagement through personalized product recommendations and seasonal marketing campaigns."
        )
    
    return {
       "customer_segment": segment,
       "segment_description": segment_details["description"],
       "business_goal": segment_details["business_goal"],
       "segment_strategy": segment_details["strategy"],

       "customer_value": value,
       "customer_activity": activity,
       "customer_engagement": engagement,
       "customer_health": health,
       "purchase_intent": purchase_intent,
      "priority": priority,
     "recommendation": " ".join(recommendations),
     }


import pandas as pd


def generate_dataset_recommendations(
    df: pd.DataFrame,
    churn_probabilities,
    customer_segments,
):
    """
    Generates recommendations for every customer in the uploaded dataset.
    """

    recommendations = []

    for (_, row), prob, segment in zip(
        df.iterrows(),
        churn_probabilities,
        customer_segments,
    ):
        recommendation = generate_recommendation(
            customer=row.to_dict(),
            churn_probability=float(prob),
            customer_segment=int(segment),
        )

        recommendations.append(recommendation)

    return recommendations