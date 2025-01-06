from unittest.mock import MagicMock

class FakeTwilioClient:
    def __init__(self, account_sid, auth_token):
        self.account_sid = account_sid
        self.auth_token = auth_token

    @property
    def messages(self):
        return self

    def create(self, body, from_, to):
        # Simulate a successful SMS message creation
        print(f"Fake SMS sent: {body} from {from_} to {to}")
        return MagicMock(sid="fake_message_sid")


def send_sms(message, to_phone_number):
    account_sid = 'your_account_sid'
    auth_token = 'your_auth_token'
    twilio_phone_number = 'your_twilio_phone_number'

    # Replace the real Twilio client with the fake one
    client = FakeTwilioClient(account_sid, auth_token)
    message = client.messages.create(
        body=message,
        from_=twilio_phone_number,
        to=to_phone_number
    )
    print(f"SMS sent: {message.sid}")


