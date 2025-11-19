import smtplib
from email.message import EmailMessage
import random

# إعداد البريد
sender_email = "jmh199635@gmail.com"
sender_password = "wcoj apaw mbur ixka"
receiver_email = "alkoolbenadey@gmail.com"

# محتوى الكود


code = random_number = random.randint(100000, 999999)


# إنشاء الرسالة
msg = EmailMessage()
msg['Subject'] = "VEMS Store verification code"
msg['From'] = sender_email
msg['To'] = receiver_email
msg.set_content(f"verification code:\n\n{code}")

# إرسال الرسالة
with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
    smtp.login(sender_email, sender_password)
    smtp.send_message(msg)

print("Email sent!")
