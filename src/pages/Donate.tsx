
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { CheckCircle, Heart, Users, Shield, ArrowRight, DollarSign } from 'lucide-react';
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

  const impactLevels = [
    {
      amount: 25,
      title: "Community Outreach",
      description: "Provides legal information to 5 individuals through community legal clinics",
      icon: Users,
      color: "from-blue-400 to-blue-600"
    },
    {
      amount: 50,
      title: "Direct Support", 
      description: "Supports a paralegal to handle one gender-based violence case",
      icon: Shield,
      color: "from-green-400 to-green-600"
    },
    {
      amount: 100,
      title: "Community Workshop",
      description: "Funds a community legal awareness workshop on land rights",
      icon: Heart,
      color: "from-purple-400 to-purple-600"
    },
    {
      amount: 250,
      title: "Digital Empowerment",
      description: "Provides digital tools and training for a paralegal to serve remote communities",
      icon: DollarSign,
      color: "from-orange-400 to-orange-600"
    }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-secondary-teal text-white py-16 md:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary-orange rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-secondary-teal rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Heart className="h-6 w-6 text-white" />
                <span className="text-white font-bold text-sm uppercase tracking-wider">Support Justice</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Every Donation <span className="text-secondary-orange">Changes Lives</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              Your support helps us promote access to justice for vulnerable communities across all 184 districts of Tanzania
            </p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary-orange mb-2">26,000+</div>
                <div className="text-sm opacity-80">Lives Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary-teal mb-2">184</div>
                <div className="text-sm opacity-80">Districts Reached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary-yellow mb-2">500+</div>
                <div className="text-sm opacity-80">Paralegals Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">85%</div>
                <div className="text-sm opacity-80">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Showcase */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">Your Impact at Every Level</h2>
            <p className="text-xl text-neutral-gray max-w-3xl mx-auto">
              See exactly how your donation creates real change in Tanzania's communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {impactLevels.map((impact, index) => (
              <div 
                key={impact.amount}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                onClick={() => handleDonationAmountSelect(impact.amount)}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${impact.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <impact.icon className="h-8 w-8 text-white" />
                </div>
                <div className={`text-2xl font-bold mb-2 bg-gradient-to-r ${impact.color} bg-clip-text text-transparent`}>
                  ${impact.amount}
                </div>
                <h3 className="font-bold text-lg text-neutral-dark mb-3">{impact.title}</h3>
                <p className="text-sm text-neutral-gray leading-relaxed">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Donation Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-teal rounded-xl flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-dark">Make Your Donation</h2>
                    <p className="text-neutral-gray">Join thousands of supporters creating change</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Enhanced Donation Amount */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <DollarSign className="h-6 w-6 mr-2 text-primary" />
                      Choose Your Impact Level
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[25, 50, 100, 250].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          className={`relative py-4 px-3 rounded-xl font-bold transition-all duration-300 border-2 ${
                            donationAmount === amount && !customAmount
                              ? 'bg-gradient-to-r from-primary to-primary-600 text-white border-primary scale-105 shadow-lg'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-primary/50'
                          }`}
                          onClick={() => handleDonationAmountSelect(amount)}
                        >
                          <div className="text-lg">${amount}</div>
                          <div className="text-xs opacity-75 mt-1">
                            {amount === 25 && "Community"}
                            {amount === 50 && "Direct Aid"}
                            {amount === 100 && "Workshop"}
                            {amount === 250 && "Digital Tools"}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          checked={customAmount}
                          onChange={handleCustomAmountToggle}
                          className="h-5 w-5 text-primary border-2 border-gray-300 focus:ring-primary"
                        />
                        <span className="text-lg font-medium group-hover:text-primary transition-colors">Custom Amount</span>
                      </label>
                      
                      {customAmount && (
                        <div className="mt-4">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                            <input
                              type="text"
                              placeholder="Enter amount"
                              value={donationAmount}
                              onChange={handleCustomAmountChange}
                              className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-secondary-teal/10 to-primary/10 rounded-xl">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isMonthly"
                          checked={donorInfo.isMonthly}
                          onChange={handleDonorInfoChange}
                          className="h-5 w-5 text-primary border-2 border-gray-300 rounded focus:ring-primary"
                        />
                        <div>
                          <span className="font-medium text-lg">Make this a monthly donation</span>
                          <p className="text-sm text-neutral-gray">Maximize your impact with sustained giving</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Enhanced Donor Information */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <Users className="h-6 w-6 mr-2 text-primary" />
                      Your Information
                    </h3>
                    
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
                  
                  {/* Enhanced Submit Button */}
                  <div className="border-t border-gray-200 pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center space-x-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Heart className="h-6 w-6" />
                          <span>Complete Your Donation</span>
                          <ArrowRight className="h-6 w-6" />
                        </>
                      )}
                    </button>
                    <div className="text-center mt-4 space-y-2">
                      <p className="text-sm text-neutral-gray flex items-center justify-center">
                        <Shield className="h-4 w-4 mr-1" />
                        Secure payment processed by Stripe
                      </p>
                      <p className="text-xs text-neutral-gray">
                        Your donation is tax-deductible to the extent allowed by law
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Enhanced Sidebar */}
            <div className="space-y-8">
              {/* Impact Calculator */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 p-6 rounded-2xl border border-primary/10">
                <h3 className="font-bold text-xl mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-primary" />
                  Your Impact Calculator
                </h3>
                <div className="space-y-4">
                  {impactLevels.map((impact) => (
                    <div key={impact.amount} className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                      <div className={`w-8 h-8 bg-gradient-to-br ${impact.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                        <impact.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">${impact.amount}</h4>
                        <p className="text-xs text-neutral-gray leading-relaxed">{impact.description}</p>
                      </div>
                    </div>
                  ))}
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
