import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import Navbar from './components/layout/Navbar'
import Hero from './components/layout/Hero'
import bg from './assets/resto.png'
import Footer from './components/layout/Footer'
import { AdminProvider } from './context/AdminContext'
import { GuestInteractionProvider } from './context/GuestInteractionContext'
import CheckoutModal from './components/guest/CheckoutModal'
import ReservationModal from './components/guest/ReservationModal'
import CateringModal from './components/guest/CateringModal'
import EventModal from './components/guest/EventModal'
import SuccessModal from './components/guest/SuccessModal'
// Admin components
import ProtectedRoute from './components/layout/ProtectedRoute'
import PageLoader from './components/layout/PageLoader'
import ContactsPage from './pages/Contacts'
import Seo from './components/seo/Seo'
import StructuredData from './components/seo/StructuredData'

const HomePage = lazy(() => import('./components/layout/Home'))
const ServicesPage = lazy(() => import('./pages/Services'))
const GalleryPage = lazy(() => import('./pages/Gallery'))
const CoffeeShopPage = lazy(() => import('./pages/CoffeeShop'))
const BakeryPage = lazy(() => import('./pages/Bakery'))
const CateringEventsPage = lazy(() => import('./pages/CateringEvents'))
const MissionValuesPage = lazy(() => import('./pages/MissionValues'))
const OurStoryPage = lazy(() => import('./pages/OurStory'))
const WhyChooseUsPage = lazy(() => import('./pages/WhyChooseUs'))
const TermsPage = lazy(() => import('./pages/Terms'))
const ExistingMenuPage = lazy(() => import('./pages/Menu'))
const PdfMenuPage = lazy(() => import('./pages/MenuPage'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails'))
const BreakfastPage = lazy(() => import('./pages/Breakfast'))
const LunchPage = lazy(() => import('./pages/Lunch'))
const DinnerPage = lazy(() => import('./pages/Dinner'))
const CocktailPage = lazy(() => import('./pages/Cocktail'))
const CoffeeBeveragePage = lazy(() => import('./pages/CoffeeBeverage'))
const AdminLoginPage = lazy(() => import('./components/Authantications/AdminLogin'))
const AdminRegisterPage = lazy(() => import('./components/Authantications/AdminRegister'))
const ResetPasswordPage = lazy(() => import('./components/Authantications/ResetPassword'))
const AdminLayoutPage = lazy(() => import('./components/admin/Layout/AdminLayout'))
const DashboardPage = lazy(() => import('./components/admin/Dashboard/DashboardPage'))
const OrderManagementPage = lazy(() => import('./components/admin/Orders/OrderManagement'))
const ReservationManagementPage = lazy(() => import('./components/admin/Reservations/ReservationManagement'))
const CateringManagementPage = lazy(() => import('./components/admin/Catering/CateringManagement'))
const MenuManagementPage = lazy(() => import('./components/admin/Menu/MenuManagement'))
const CategoryManagementPage = lazy(() => import('./components/admin/Categories/CategoryManagement'))
const ContentManagementPage = lazy(() => import('./components/admin/Content/ContentManagement'))
const ReportsPage = lazy(() => import('./components/admin/Reports/ReportsPage'))
const SettingsPage = lazy(() => import('./components/admin/Settings/SettingsPage'))
const PromotionManagementPage = lazy(() => import('./components/admin/Promotions/PromotionManagement'))
const FeaturedServicesManagementPage = lazy(() => import('./components/admin/FeaturedServices/FeaturedServicesManagement'))

// Helper component to conditionally show Footer
const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  return <Footer />;
};

const RouteAwareSeo: React.FC = () => {
  const location = useLocation()
  const pathname = location.pathname

  const seoConfig = (() => {
    if (pathname.startsWith('/menu')) {
      return {
        title: 'Menu | Moor Hall',
        description: 'Explore Moor Hall’s breakfast, lunch, dinner, cocktails, and specialty coffee menu.',
        path: pathname,
      }
    }

    if (pathname.startsWith('/gallery')) {
      return {
        title: 'Gallery | Moor Hall',
        description: 'View Moor Hall’s food, coffee shop, bakery, and catering highlights.',
        path: pathname,
      }
    }

    if (pathname.startsWith('/about')) {
      return {
        title: 'About Moor Hall',
        description: 'Learn about Moor Hall’s story, mission, and values.',
        path: pathname,
      }
    }

    if (pathname === '/contacts' || pathname === '/contact') {
      return {
        title: 'Contact Moor Hall',
        description: 'Get in touch with Moor Hall for reservations, catering, and general enquiries.',
        path: pathname,
      }
    }

    if (pathname === '/services') {
      return {
        title: 'Services | Moor Hall',
        description: 'Discover Moor Hall’s restaurant, catering, private events, and hospitality services.',
        path: pathname,
      }
    }

    if (pathname === '/terms') {
      return {
        title: 'Terms & Conditions',
        description: 'Review Moor Hall’s website terms and conditions.',
        path: pathname,
      }
    }

    return {
      title: 'Moor Hall | Restaurant, Coffee & Catering',
      description: 'Moor Hall offers exceptional dining, specialty coffee, fresh bakery, and tailored catering for memorable events.',
      path: pathname,
    }
  })()

  return <Seo title={seoConfig.title} description={seoConfig.description} path={seoConfig.path} />
}

export default function App() {
	return (
		<Provider store={store}>
			<AdminProvider>
				<GuestInteractionProvider>
					<Router>
						<div className="min-h-screen flex flex-col">
							<RouteAwareSeo />
							<StructuredData />
							<Suspense fallback={<PageLoader />}>
								<Routes>
								<Route path="/" element={
									<>
										{/* Top area: shared background for navbar and hero */}
										<header
											className="relative w-full bg-cover bg-center bg-fixed min-h-screen pt-24"
											style={{ 
												backgroundImage: `url(${bg})`, 
												backgroundRepeat: 'no-repeat', 
												backgroundSize: 'cover',
												backgroundAttachment: 'fixed'
											}}
										>
											<div className="">
												<Navbar />
												<Hero />
											</div>
										</header>
										<div className="mt-8">
											<HomePage />
										</div>
									</>
								} />
								<Route path="/contacts" element={
									<>
										<Navbar />
										<ContactsPage />
									</>
								} />
								<Route path="/menu" element={
									<>
										<Navbar />
										<ExistingMenuPage />
									</>
								} />
								<Route path="/menu/viewer" element={
									<>
										<Navbar />
										<PdfMenuPage />
									</>
								} />
								<Route path="/menu/Breakfast" element={
									<>
										<Navbar />
										<BreakfastPage />
									</>
								} />
								<Route path="/menu/*" element={
									<>
										<Navbar />
										<ExistingMenuPage />
									</>
								} />
								<Route path="/menu/Lunch" element={
									<>
										<Navbar />
										<LunchPage />
									</>
								} />
								<Route path="/menu/Dinner" element={
									<>	
										<Navbar />
										<DinnerPage />
									</>
								} />
								<Route path="/menu/Cocktail" element={
									<>	
										<Navbar />
										<CocktailPage />
									</>
								} />
								<Route path="/menu/Coffee-Beverage" element={
									<>	
										<Navbar />
										<CoffeeBeveragePage />
									</>
								} />
								<Route path="/contact" element={
									<>
										<Navbar />
										<ContactsPage />
									</>
								} />
								<Route path="/services" element={
									<>
										<Navbar />
										<ServicesPage />
									</>
								} />
								<Route path="/gallery/food" element={
									<>
										<Navbar />
										<GalleryPage />
									</>
								} />
								<Route path="/gallery/coffee-shop" element={
									<>
										<Navbar />
										<CoffeeShopPage />
									</>
								} />
								<Route path="/gallery/bakery" element={
									<>
										<Navbar />
										<BakeryPage />
									</>
								} />
								<Route path="/gallery/catering-events" element={
									<>
										<Navbar />
										<CateringEventsPage />
									</>
								} />
								<Route path="/about/mission" element={
									<>
										<Navbar />
										<MissionValuesPage />
									</>
								} />
								<Route path="/about/our-story" element={
									<>
										<Navbar />
										<OurStoryPage />
									</>
								} />
								<Route path="/about/why-us" element={
									<>
										<Navbar />
										<WhyChooseUsPage />
									</>
								} />
								<Route path="/terms" element={
									<>
										<Navbar />
										<TermsPage />
									</>
								} />
								<Route path="/product" element={
									<>
										<Navbar />
										<ProductDetailsPage />
									</>
								} />
								
								/* Admin Routes - No Navbar or Footer for admin area */
							   <Route path="/admin/login" element={
									<>
										<AdminLoginPage />
									</>
								} />
								<Route path="/admin/register" element={
																	<>
																		<AdminRegisterPage />
																	</>
																} />
																<Route path="/reset-password" element={
																	<>
																		<ResetPasswordPage />
																	</>
																} />
																<Route path="/admin" element={
																	<ProtectedRoute>
																		<AdminLayoutPage />
																	</ProtectedRoute>
																}
																>
																	<Route index element={<Navigate to="dashboard" replace />} />
																	<Route path="dashboard" element={<DashboardPage />} />
																	<Route path="orders" element={<OrderManagementPage />} />
																	
																										<Route path="reservations" element={<ReservationManagementPage />} />
																	<Route path="catering" element={<CateringManagementPage />} />
																	<Route path="menu" element={<MenuManagementPage />} />
																	<Route path="categories" element={<CategoryManagementPage />} />
																	<Route path="promotions" element={<PromotionManagementPage />} />
																	<Route path="featured-services" element={<FeaturedServicesManagementPage />} />
																	<Route path="content" element={<ContentManagementPage />} />
																	<Route path="reports" element={<ReportsPage />} />
																	<Route path="settings" element={<SettingsPage />} />
																</Route>
															</Routes>
							</Suspense>
														{/* Footer - only shown on non-admin routes */}
						<ConditionalFooter />
						{/* Guest Interaction Modals */}
						<CheckoutModal />
						<ReservationModal />
						<CateringModal />
						<EventModal />
						<SuccessModal />
					</div>
				</Router>
				</GuestInteractionProvider>
			</AdminProvider>
		</Provider>
	)
}