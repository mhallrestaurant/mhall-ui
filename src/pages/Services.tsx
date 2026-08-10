import React from 'react'
import servi from '../assets/servi.png'
import { useGuestInteraction } from '../context/GuestInteractionContext';

const Services: React.FC = () => {
  const { quickCheckout, openReservation, openCatering, openEvent } = useGuestInteraction();

  const handleServiceOrder = (serviceId: string, name: string, price: number) => {
    quickCheckout({
      id: `cart_${serviceId}_${Date.now()}`,
      menuItemId: serviceId,
      name,
      price,
      quantity: 1,
    });
  };

  return (
    <div >
      {/* Services Section with servi.png background */}
       <section className="relative py-12 sm:py-16 min-h-screen overflow-hidden">
        {/* Background image cover */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${servi})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Restaurant Dining Card */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-2xl p-4 sm:p-6 opacity-95">
              <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" 
                  alt="Restaurant Dining" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Restaurant Dining</h3>
              <p className="text-xs sm:text-base text-center mb-4 sm:mb-6">
                Enjoy a comfortable dine in Experience with Premium service and delicious Meals
              </p>
              <div className="text-center">
                <button 
                  onClick={openReservation}
                  className="bg-red-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded font-bold text-sm sm:text-lg"
                >
                  Reserve Table
                </button>
              </div>
            </div>

            {/* Fast Delivery Card */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-2xl p-4 sm:p-6 opacity-95">
              <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600" 
                  alt="Fast Delivery" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Fast Delivery</h3>
              <p className="text-xs sm:text-base text-center mb-4 sm:mb-6">
                Get your favorite meals delivered hot and Fresh to your Doorstep.
              </p>
               <div className="text-center">
                  <button
                    onClick={() => handleServiceOrder('fast_delivery', 'Fast Delivery Service', 5000)}
                    className="bg-red-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded font-bold text-sm sm:text-lg"
                  >
                    Order Now
                  </button>
                </div>
            </div>

            {/* Coffee Service Card */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-2xl p-4 sm:p-6 opacity-95">
              <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600" 
                  alt="Coffee Service" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Coffee Service</h3>
              <p className="text-xs sm:text-base text-center mb-4 sm:mb-6">
                Freshly brewed coffee made with High quality Beans.
              </p>
               <div className="text-center">
                  <button
                    onClick={() => handleServiceOrder('coffee_service', 'Coffee Service', 3000)}
                    className="bg-red-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded font-bold text-sm sm:text-lg"
                  >
                    Order Coffee
                  </button>
                </div>
            </div>

            {/* Bakery service Card */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-2xl p-4 sm:p-6 opacity-95">
              <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600" 
                  alt="Bakery service" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Bakery service</h3>
              <p className="text-xs sm:text-base text-center mb-4 sm:mb-6">
                Delicious Cakes,pastries and Baked Goods made Fresh daily.
              </p>
              <div className="text-center">
                <button className="bg-red-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded font-bold text-sm sm:text-lg">
                  View Bakery
                </button>
              </div>
            </div>

            {/* Outside Catering Card */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-2xl p-4 sm:p-6 opacity-95">
              <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?w=600" 
                  alt="Outside Catering"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Outside Catering</h3>
              <p className="text-xs sm:text-base text-center mb-4 sm:mb-6">
                We provide Catering services for Meetings, parties,and special Events
              </p>
              <div className="text-center">
                <button 
                  onClick={openCatering}
                  className="bg-red-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded font-bold text-sm sm:text-lg"
                >
                  Request catering
                </button>
              </div>
            </div>

            {/* Event Service Card */}
            <div className="bg-gray-200 border-4 border-gray-300 rounded-2xl p-4 sm:p-6 opacity-95">
              <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" 
                  alt="Event Service" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">Event Service</h3>
              <p className="text-xs sm:text-base text-center mb-4 sm:mb-6">
                Host your Events with us, Birthdays party and weddings & Corporate events.
              </p>
              <div className="text-center">
                <button 
                  onClick={openEvent}
                  className="bg-red-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded font-bold text-sm sm:text-lg"
                >
                  Book Event
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
