
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState<number | string>('');
  const [customAmount, setCustomAmount] = useState<boolean>(false);
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    isMonthly: false,
    isAnonymous: false,
    dedicationType: 'none',
    dedicationName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonationAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount(false);
  };

  const handleCustomAmountToggle = () => {
    setCustomAmount(true);
    setDonationAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value || /^\d+$/.test(value)) {
      setDonationAmount(value === '' ? '' : parseInt(value));
    }
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setDonorInfo({
        ...donorInfo,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setDonorInfo({
        ...donorInfo,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!donationAmount) {
      toast.error("Please select or enter a donation amount.");
      return;
    }
    
    if (!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email) {
      toast.error("Please complete all required fields.");
      return;
    }
    
    // Simulate form submission
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for your donation! You will receive a confirmation email shortly.");
      // Reset form
      setDonationAmount('');
      setCustomAmount(false);
      setDonorInfo({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        isMonthly: false,
        isAnonymous: false,
        dedicationType: 'none',
        dedicationName: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary-orange pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Work</h1>
            <p className="text-xl opacity-90">
              Your donation helps us promote access to justice for vulnerable communities across Tanzania.
            </p>
          </div>
        </div>
      </section>
      
      {/* Donation Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Make a Donation</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Donation Amount */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Donation Amount</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[25, 50, 100, 250].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`py-3 rounded-md font-bold transition-colors ${
                          donationAmount === amount && !customAmount
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleDonationAmountSelect(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={customAmount}
                        onChange={handleCustomAmountToggle}
                        className="h-4 w-4 text-primary"
                      />
                      <span>Custom Amount</span>
                    </label>
                    
                    {customAmount && (
                      <div className="mt-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="text"
                            placeholder="Enter amount"
                            value={donationAmount}
                            onChange={handleCustomAmountChange}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isMonthly"
                        checked={donorInfo.isMonthly}
                        onChange={handleDonorInfoChange}
                        className="h-4 w-4 text-primary"
                      />
                      <span>Make this a monthly donation</span>
                    </label>
                  </div>
                </div>
                
                {/* Donor Information */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block mb-2 font-medium">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={donorInfo.firstName}
                        onChange={handleDonorInfoChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block mb-2 font-medium">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={donorInfo.lastName}
                        onChange={handleDonorInfoChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="email" className="block mb-2 font-medium">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={donorInfo.email}
                      onChange={handleDonorInfoChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="country" className="block mb-2 font-medium">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={donorInfo.country}
                      onChange={handleDonorInfoChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a country</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={donorInfo.isAnonymous}
                        onChange={handleDonorInfoChange}
                        className="h-4 w-4 text-primary"
                      />
                      <span>Make my donation anonymous</span>
                    </label>
                  </div>
                </div>
                
                {/* Dedication */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Dedication (Optional)</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dedicationType"
                          value="none"
                          checked={donorInfo.dedicationType === 'none'}
                          onChange={handleDonorInfoChange}
                          className="h-4 w-4 text-primary"
                        />
                        <span>No dedication</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dedicationType"
                          value="honor"
                          checked={donorInfo.dedicationType === 'honor'}
                          onChange={handleDonorInfoChange}
                          className="h-4 w-4 text-primary"
                        />
                        <span>In honor of</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dedicationType"
                          value="memory"
                          checked={donorInfo.dedicationType === 'memory'}
                          onChange={handleDonorInfoChange}
                          className="h-4 w-4 text-primary"
                        />
                        <span>In memory of</span>
                      </label>
                    </div>
                  </div>
                  
                  {donorInfo.dedicationType !== 'none' && (
                    <div className="mt-4">
                      <label htmlFor="dedicationName" className="block mb-2 font-medium">Name</label>
                      <input
                        type="text"
                        id="dedicationName"
                        name="dedicationName"
                        value={donorInfo.dedicationName}
                        onChange={handleDonorInfoChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>
                
                {/* Message */}
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={donorInfo.message}
                    onChange={handleDonorInfoChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Share why you're supporting our work..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-primary text-white py-3 px-6 rounded-md font-bold hover:bg-primary/90 transition-colors duration-300 w-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing...' : 'Donate Now'}
                  </button>
                  <p className="text-sm text-neutral-gray mt-2 text-center">
                    Secure payment processed by Stripe
                  </p>
                </div>
              </form>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-neutral-light p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Your Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-bold">$25</h4>
                      <p className="text-sm text-neutral-gray">Provides legal information to 5 individuals through community legal clinics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-bold">$50</h4>
                      <p className="text-sm text-neutral-gray">Supports a paralegal to handle one gender-based violence case</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-bold">$100</h4>
                      <p className="text-sm text-neutral-gray">Funds a community legal awareness workshop on land rights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-bold">$250</h4>
                      <p className="text-sm text-neutral-gray">Provides digital tools and training for a paralegal to serve remote communities</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-4">Other Ways to Give</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-1">By Check</h4>
                    <p className="text-sm text-neutral-gray">
                      Make checks payable to "Legal Services Facility" and mail to:<br />
                      Plot No. 1, Jillian Plaza<br />
                      Mbezi Beach, Dar es Salaam<br />
                      Tanzania
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-1">Bank Transfer</h4>
                    <p className="text-sm text-neutral-gray">
                      For bank transfer details, please contact our finance department:<br />
                      <a href="mailto:finance@lsftz.org" className="text-primary">finance@lsftz.org</a>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-1">Corporate Partnerships</h4>
                    <p className="text-sm text-neutral-gray">
                      For corporate giving opportunities, please contact:<br />
                      <a href="mailto:partnerships@lsftz.org" className="text-primary">partnerships@lsftz.org</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Supporters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <p className="italic mb-4">
                "Supporting LSF was one of the best decisions I've made. Their work in providing legal aid to women 
                in rural communities has created real change in people's lives."
              </p>
              <p className="font-bold">- Sarah M., Monthly Donor</p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <p className="italic mb-4">
                "As a corporate partner, we've seen firsthand how LSF maximizes every donation to create sustainable 
                access to justice solutions across Tanzania."
              </p>
              <p className="font-bold">- James L., Corporate Sponsor</p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <p className="italic mb-4">
                "I donate to honor my mother, who always fought for justice. LSF's work empowering communities to 
                understand their legal rights continues her legacy."
              </p>
              <p className="font-bold">- Maria K., Donor</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Is my donation tax-deductible?</h3>
              <p className="text-neutral-gray">
                Yes, LSF is a registered non-profit organization, and donations are tax-deductible to the extent allowed by law in Tanzania. 
                For international donors, tax deductibility depends on your country's regulations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">How are funds used?</h3>
              <p className="text-neutral-gray">
                Your donations directly support our programs in legal empowerment, gender justice, climate justice, and digital transformation. 
                Administrative costs are kept to a minimum, with over 85% of funds going directly to program activities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Can I choose which program my donation supports?</h3>
              <p className="text-neutral-gray">
                Yes, donors can specify if they want their contribution to support a particular program area. 
                Please indicate your preference in the message field or contact us directly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">How can I get a receipt for my donation?</h3>
              <p className="text-neutral-gray">
                A receipt will automatically be emailed to you after your online donation is processed. 
                If you donate by check or bank transfer, a receipt will be sent to the address or email provided.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
