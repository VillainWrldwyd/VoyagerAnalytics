from pydantic import BaseModel


class AccountCreate(BaseModel):

    broker: str

    account_number: str

    server: str

    investor_password: str