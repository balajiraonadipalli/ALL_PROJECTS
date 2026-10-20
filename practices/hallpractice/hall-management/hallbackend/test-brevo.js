require('dotenv').config();

async function testBrevoAPI() {
  console.log('=== BREVO API KEY TEST ===\n');
  
  // Check environment variables
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
  const brevoEmail = process.env.BREVO_EMAIL || process.env.EMAIL_FROM || "akashbalu2001@gmail.com";
  
  console.log('Environment Variables:');
  console.log('BREVO_API_KEY:', brevoApiKey ? `${brevoApiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('BREVO_SMTP_KEY:', process.env.BREVO_SMTP_KEY ? `${process.env.BREVO_SMTP_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('BREVO_EMAIL:', brevoEmail);
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
  console.log('');
  
  if (!brevoApiKey) {
    console.error('❌ ERROR: No Brevo API key found!');
    console.error('Set BREVO_API_KEY or BREVO_SMTP_KEY in your .env file');
    process.exit(1);
  }
  
  // Check key type
  if (brevoApiKey.startsWith('xsmtpsib-')) {
    console.warn('⚠️  WARNING: You are using an SMTP key (xsmtpsib-...)');
    console.warn('   Brevo API requires an API key (xkeysib-...)');
    console.warn('   Get API key from: https://app.brevo.com/settings/keys/api');
    console.warn('   SMTP keys do NOT work with the REST API!\n');
  } else if (brevoApiKey.startsWith('xkeysib-')) {
    console.log('✅ Key format looks correct (API key: xkeysib-...)\n');
  } else {
    console.warn('⚠️  WARNING: Key format unexpected');
    console.warn('   API keys should start with: xkeysib-');
    console.warn('   SMTP keys start with: xsmtpsib-\n');
  }
  
  // Test API call
  console.log('Testing Brevo API connection...\n');
  
  try {
    const testEmail = process.argv[2] || "akashbalu2001@gmail.com";
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Hall Booking System',
          email: brevoEmail
        },
        to: [{ email: testEmail }],
        subject: 'Test Email from Brevo API',
        htmlContent: '<h1>Test Email</h1><p>If you receive this, your Brevo API key is working!</p>',
        textContent: 'Test Email - If you receive this, your Brevo API key is working!'
      })
    });
    
    const data = await response.json();
    
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    console.log('');
    
    if (response.ok) {
      console.log('✅ SUCCESS! Brevo API key is working!');
      console.log(`✅ Email sent to: ${testEmail}`);
      console.log(`✅ Message ID: ${data.messageId}`);
      console.log('\n🎉 Your API key is valid and working!');
      console.log('You can now use it in production (Render).');
    } else {
      console.error('❌ ERROR: Brevo API call failed');
      console.error('Error Code:', data.code);
      console.error('Error Message:', data.message);
      console.log('');
      
      if (data.code === 'unauthorized' || data.message === 'Key not found') {
        console.error('🔍 TROUBLESHOOTING:');
        console.error('1. Make sure you are using an API key (xkeysib-...), not SMTP key (xsmtpsib-...)');
        console.error('2. Get API key from: https://app.brevo.com/settings/keys/api');
        console.error('3. Make sure the key is correct (no extra spaces)');
        console.error('4. Check if the key is active in Brevo dashboard');
      }
      
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testBrevoAPI();




