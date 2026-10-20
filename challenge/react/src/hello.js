import axios from 'axios'

(async () => {
  try {
    const email = "balajirao.nadipalli@gmail.com";
    const password = "HENNGECHALLENGE";
    const token = Buffer.from(`${email}:${password}`).toString("base64");

    const response = await axios.post(
      "https://api.challenge.hennge.com/challenges/frontend-password-validation/001",
      {
        contact_email: "balajirao.nadipalli@gmail.com",
        github_url: "https://gist.github.com/balajiraonadipalli/eed88892c6858c81b340c86b64d96495",
        solution_framework: "react"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      }
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
})();
