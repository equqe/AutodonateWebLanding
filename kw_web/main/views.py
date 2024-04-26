from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from yookassa import Payment, Configuration, Webhook
from rcon.source import Client
import json
import uuid


def index(request):
    return render(request, 'main/index.html')
    
def contacts(request):
    return render(request, "main/contacts.html")
    
@csrf_exempt
def create_payment(request):
    data = json.loads(request.body)
    amount = data['amount']
    username = data['username']
    donate = data['donate']
    email = data['email']

    Configuration.account_id = ''
    Configuration.secret_key = ''

    if request.method == 'POST':

        payment = Payment.create({
            "amount": {
                "value": amount,
                "currency": "RUB"
            },
            "confirmation": {
                "type": "embedded"
            },
            "capture": "True",
            "metadata": {
                "user": username,
                "donate": donate
            },
            "receipt": {
                "customer": {
                    "username": username,
                    "email": email
                },
                "items": [
                    {
                        "description": "Пожертвование серверу(привилегия/ключ кейса)",
                        "quantity": "1.00",
                        "amount": {
                            "value": amount,
                            "currency": "RUB"
                        },
                        "vat_code": "2",
                        "payment_mode": "full_payment"
                    }
                ]
            }
        }, uuid.uuid4())
        
        confirm = payment.confirmation.confirmation_token
        response_data = {'confirmation_token': confirm}
        return JsonResponse(response_data)
        
def handle_webhook(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['username']
        donate = data['donate']
        amount = data['amount']
        
        commands = {
            "eco": "eco give {} {}".format,
            "rabbit": "lp user {} parent set rabbit".format,
            "shooter": "lp user {} parent set shooter".format,
            "warrior": "lp user {} parent set warrior".format,
            "dolphin": "lp user {} parent set dolphin".format,
            "bear": "lp user {} parent set bear".format,
            "hero": "lp user {} parent set hero".format,
            "dragon": "lp user {} parent set dragon".format,
            "emperor": "lp user {} parent set emperor".format,
            "knyaz": "lp user {} parent set knyaz".format,
            "522": "lootcrate give {} 522 1".format,
            "876": "lootcrate give {} 876 1".format,
            "773": "lootcrate give {} 773 1".format,
            "450": "lootcrate give {} 450 1".format,
        }
        
        data = request.POST
        
        if data['event'] == 'payment.succeeded':
            command = commands.get(donate)
            if command:
                command = command(username, amount)
                with Client('', 25668, passwd='') as client:
                    response = client.run(command)
            
        return HttpResponse(status=200)
        
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
