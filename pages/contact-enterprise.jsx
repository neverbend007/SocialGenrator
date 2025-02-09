import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navigation from '../components/Navigation';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { toast, Toaster } from 'react-hot-toast';

export default function ContactEnterprise() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    business_email: '',
    phone_number: '',
    cust_message: ''
  });

  // Prevent direct URL access
  useEffect(() => {
    // Check if user came from pricing page
    if (!router.query.from || router.query.from !== 'pricing') {
      router.replace('/pricing');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Log the data we're trying to insert (for debugging)
      console.log('Attempting to insert:', {
        company_name: formData.company_name,
        contact_name: formData.contact_name,
        business_email: formData.business_email,
        phone_number: formData.phone_number || null,
        cust_message: formData.cust_message,
        created_at: new Date().toISOString()
      });

      const { data, error } = await supabaseAdmin
        .from('EnterpriseRequests')
        .insert([
          {
            company_name: formData.company_name,
            contact_name: formData.contact_name,
            business_email: formData.business_email,
            phone_number: formData.phone_number || null,
            cust_message: formData.cust_message,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error); // Log the full error
        throw error;
      }

      toast.success('Inquiry submitted successfully!');
      setSubmitted(true);

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinished = () => {
    router.push('/');
  };

  return (
    <>
      <Navigation session={session} />
      <div className="container">
        <div className="content-container">
          {!submitted ? (
            <>
              <h1 className="page-title">Enterprise Inquiry</h1>
              <div className="contact-form-container">
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="company_name">Company Name *</label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact_name">Contact Name *</label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="business_email">Business Email *</label>
                    <input
                      type="email"
                      id="business_email"
                      name="business_email"
                      value={formData.business_email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cust_message">Message *</label>
                    <textarea
                      id="cust_message"
                      name="cust_message"
                      value={formData.cust_message}
                      onChange={handleChange}
                      required
                      className="form-input form-textarea"
                      placeholder="Tell us about your needs and requirements"
                      rows="4"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="thank-you-container">
              <h1 className="page-title">Thank You!</h1>
              <div className="thank-you-message">
                <p>
                  We appreciate your interest in our Enterprise solution. Our team has received your inquiry and will review it promptly.
                </p>
                <p>
                  You can expect to hear back from one of our team members within the next 48 hours to discuss your requirements in detail.
                </p>
              </div>
              <button 
                onClick={handleFinished}
                className="finished-button"
              >
                Finished
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
} 