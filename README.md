# ShareXis

ShareXis is a modern file-sharing platform built with Next.js, integrating payment and authentication features.

## 🚀 Features

- 📤 Secure file sharing
- 💳 Payment integration (PayPal, Stripe, Solana)
- 🔐 Authentication via Supabase
- 🌓 Dark/Light mode
- 🌍 Internationalization
- ⚡ Performance optimized with Next.js 15

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Accounts for payment services (optional)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ShareXis.git
cd ShareXis
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env.local` file at the project root and add:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_supabase_key
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

4. Initialize the database:
```bash
npm run setup-db
```

5. Launch the development server:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Project Structure

```
ShareXis/
├── app/                 # Next.js pages and routes
├── components/          # Reusable React components
├── lib/                 # Utilities and configurations
├── public/             # Static files
├── migrations/         # Database migrations
├── scripts/           # Utility scripts
└── supabase/          # Supabase configuration
```

## 📚 Available Scripts

- `npm run dev` : Launches the development server
- `npm run build` : Builds the application for production
- `npm run start` : Starts the production server
- `npm run lint` : Checks the code with ESLint
- `npm run cleanup` : Cleans up temporary files
- `npm run setup-db` : Configures the database

## 📜 Detailed Configuration Scripts

### Database Configuration

The project uses several scripts to configure the Supabase database:

1. `setup-database.js`
   - Initializes the main structure of the database
   - Creates necessary tables and relationships
   - Configures security policies

2. `setup-subscriptions.js`
   - Configures the subscription system
   - Creates tables to manage subscriptions
   - Sets up triggers for payment management

3. `setup-exec-sql.js`
   - Configures custom SQL functions
   - Sets up stored procedures

### Cleanup Scripts

`cleanup.js` :
- Cleans up temporary uploaded files
- Deletes expired sessions
- Optimizes storage space

### SQL Scripts

The project includes several SQL files for configuration:
- `create_subscriptions_table.sql` : Subscription structure
- `create_device_mapping_tables.sql` : Device mapping
- `create_exec_sql_function.sql` : Custom SQL functions
- `insert_test_subscription.sql` : Test data

## 🔧 Configuration

### Supabase
1. Create a project on Supabase
2. Configure necessary tables via migrations
3. Add appropriate environment variables

### Payments
- Stripe : Configure your account and add the secret key
- PayPal : Configure your developer account and add the client ID
- Solana : Configure the wallet adapter as needed

## 🤝 Contribution

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the `LICENSE` file for more details.

## 🆘 Support

For any questions or issues:
- Open an issue on GitHub
- Consult the documentation in the `docs/` folder

## ⚡ Performance

The application is optimized for:
- High Lighthouse score
- Fast page loading
- SEO optimization
- Accessibility

## 🔐 Security

- Secure authentication via Supabase
- Secure file storage
- Protection against CSRF attacks
- User input validation

---

Developed with ❤️ by the ShareXis team
