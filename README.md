# Cloud Tech Demo

We chose to demo AWS SQS, it's a simple queue service we're exploring it's usecases and comparing it to Google Clouds offering.

## Usage

Install Deno

**Linux/Mac OS**
```sh
curl -fsSL https://deno.land/install.sh | sh
```

**Windows**
```powershell
irm https://deno.land/install.ps1 | iex
```

Setup a `.env.local` you can use the `.env.example.local` file to help with the setup.

Run the `send` and `recieve` script.
```sh
# Sending to AWS SQS
deno task send

# Recieving from AWS SQS
deno task recieve
```