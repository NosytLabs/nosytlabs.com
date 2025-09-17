import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  // Here you would typically send an email or save the data to a database
  console.log({ name, email, message });

  return new Response(
    JSON.stringify({
      message: "Your message has been sent successfully!"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};