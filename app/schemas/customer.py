from pydantic import BaseModel


class CustomerChurnRequest(BaseModel):
    Age : int
    Gender : str
    Membership : str

    Total_Orders: int
    Average_Order_Value: float
    Total_Spend: float
    Days_Since_Last_Purchase: int
    Average_Orders_Per_Month: float
    Wishlist_Items: int
    Cart_Abandonment_Rate: float
    Coupons_Used: int
    Return_Rate: float
    App_Sessions_Per_Month: int
    Average_Session_Duration: float
    Customer_Support_Tickets: int
    Product_Categories_Purchased: int
    
    Payment_Method : str
    Preferred_Shopping_Time : str


class CustomerSegmentationRequest(BaseModel):
    Total_Orders: int
    Average_Order_Value: float
    Total_Spend: float
    Days_Since_Last_Purchase: int
    Average_Orders_Per_Month: float
    Wishlist_Items: int
    Cart_Abandonment_Rate: float
    Coupons_Used: int
    Return_Rate: float
    App_Sessions_Per_Month: int
    Average_Session_Duration: float
    Customer_Support_Tickets: int
    Product_Categories_Purchased: int