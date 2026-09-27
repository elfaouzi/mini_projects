import emailjs from '@emailjs/browser';

export const sendUserCredentialsEmail = async ({
  to_email,
  to_name,
  password,
  role
}: {
  to_email: string;
  to_name: string;
  password: string;
  role: string;
}) => {
  // Fill these with your EmailJS config
  const SERVICE_ID = '';
  const TEMPLATE_ID = '';
  const PUBLIC_KEY = '';

  const templateParams = {
    to_email,
    to_name,
    password,
    role,
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    return result;
  } catch (error) {
    throw error;
  }
};
