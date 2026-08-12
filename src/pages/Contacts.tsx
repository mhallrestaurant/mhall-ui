import React, { useState } from 'react'
import conta from '../assets/conta.jpg'
import chief from '../assets/chief.jpg'

const Contacts: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, lastName, email, phone, subject, message } = formData
    const body = `Name: ${firstName} ${lastName}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`
    window.location.href = `mailto:mhallrestaurant@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
     <div>
       {/* Contact Section with conta.jpg background */}
       <section className="relative py-12 sm:py-16 min-h-screen overflow-hidden">
        {/* Background image cover */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${conta})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Page Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 mb-8">
          <h2 className="text-white text-2xl font-bold text-center mb-12">
            Get in Touch. we'd love to hear from you, Reach out through any channel Below
          </h2>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-xl p-8 opacity-95">
              <h3 className="text-2xl font-bold mb-8 text-center">send us Message</h3>
              {submitted && <p className="text-green-600 text-center mb-4 font-bold">Message sent! Opening email client...</p>}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-bold mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="your name" 
                      className="w-full px-4 py-3 border border-gray-400 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="last name" 
                      className="w-full px-4 py-3 border border-gray-400 rounded"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block font-bold mb-2">Email address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="You@gmail.com" 
                    className="w-full px-4 py-3 border border-gray-400 rounded"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block font-bold mb-2">Phone number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+25 07xxxxxxx" 
                    className="w-full px-4 py-3 border border-gray-400 rounded"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block font-bold mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="what is this regarding?" 
                    className="w-full px-4 py-3 border border-gray-400 rounded"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-bold mb-2">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="write your message here....." 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-400 rounded"
                      required
                    />
                  </div>
                  <div className="flex items-end mb-1 justify-center">
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md font-bold w-full text-lg">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Contact Details Side */}
            <div>
              {/* Contact Info Card */}
              <div className="bg-gray-200 border-4 border-gray-300 rounded-xl p-8 opacity-95 mb-8">
                <h3 className="text-2xl font-bold mb-8 text-center">Contact details</h3>
                
                <div className="space-y-6">
                   {/* Phone Number */}
                   <div className="flex items-center gap-4">
                     <img src={chief} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white" />
                     <div>
                       <p className="font-bold text-lg">Phone number</p>
                       <p className="text-[#D4A017] font-bold">+(250)788 658 316</p>
                       <p className="text-gray-600">+(250)787 775 729 reservation</p>
                     </div>
                   </div>
                   
                   {/* Email Address */}
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                       <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                       </svg>
                     </div>
                     <div>
                       <p className="font-bold text-lg">Email Address</p>
                       <p className="text-[#D4A017] font-bold">mhallrestaurant@gmail.com</p>
                       <p className="text-gray-600">Booking@Moorhall.rw</p>
                     </div>
                   </div>
                   
                   {/* Location */}
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                       <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                       </svg>
                     </div>
                     <div>
                       <p className="font-bold text-lg">Location</p>
                       <p className="text-[#D4A017] font-bold">25M6+9VF, Kigali</p>
                       <p className="text-gray-600">Gasabo , Rwanda</p>
                     </div>
                   </div>
                </div>
                
                {/* Map */}
                <div className="mt-8 overflow-hidden rounded-lg border border-gray-300 bg-white">
                 <iframe
                 src="https://www.google.com/maps/embed?pb=!4v1783589346025!6m8!1m7!1s7_h935J_k0oDfwfrx6yIXA!2m2!1d-1.966454131559618!2d30.162203761095!3f190.50243!4f0!5f0.7820865974627469"
                 className="h-48 w-full"
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
                 referrerPolicy="strict-origin-when-cross-origin"
                 title="Moor Hall location"
                 allow="accelerometer; gyroscope; magnetometer"
               />
                </div>
              </div>

              {/* Quick Connection */}
              <div className="bg-gray-200 border-4 border-gray-300 rounded-xl p-8 opacity-95">
                <h3 className="text-xl font-bold mb-6 text-center">quick connection</h3>
                
                <button 
                  onClick={() => window.open('https://wa.me/250787775729', '_blank')}
                  className="bg-green-500 text-white w-full py-4 rounded-2xl font-bold text-2xl flex items-center justify-center gap-3 mb-6"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on whatsApp
                </button>

                <p className="font-bold mb-4">Follow Us</p>
                <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => window.open('https://instagram.com', '_blank')}
                     className="bg-white py-3 rounded font-bold flex items-center justify-center gap-2"
                   >
                     <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                     </svg>
                     Instagram
                   </button>
                   <button 
                     onClick={() => window.open('https://facebook.com', '_blank')}
                     className="bg-white py-3 rounded font-bold flex items-center justify-center gap-2"
                   >
                     <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                     </svg>
                     Facebook
                   </button>
                   <button 
                     onClick={() => window.open('https://tiktok.com', '_blank')}
                     className="bg-white py-3 rounded font-bold flex items-center justify-center gap-2"
                   >
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                     </svg>
                     Tik Tok
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours - Bottom Left */}
          <div className="mt-8 max-w-md">
            <div className="bg-gray-200 border-4 border-gray-300 rounded-xl p-8 opacity-95">
              <h3 className="text-2xl font-bold mb-6 text-center">Opening Hours</h3>
              
              <div className="space-y-4 text-center">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-bold">06;00 - 00;00</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-bold">06:00 - 02;00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-bold">06;00 - 01;00</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-400">
                  <span className="font-bold">Public Holidays</span>
                  <span className="font-bold text-red-600">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contacts
