// app/terms/page.js
"use client";

import React from "react";

export default function TermsPage() {
  return (
    <main className="bg-[var(--soft-gray)] min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-[var(--warm-beige)] py-4">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-[var(--gold-accent)] hover:text-[var(--copper)] transition-colors">Home</a>
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-[var(--charcoal)]">Terms of Service</span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 mb-6">Legal agreements and terms governing the use of LuxeFurniture</p>
          <div className="bg-[var(--soft-gray)] p-4 rounded-lg inline-block">
            <p className="text-sm text-gray-600">
              <i className="fa-solid fa-calendar-alt text-[var(--gold-accent)] mr-2"></i>
              Last Updated: December 13, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-[var(--soft-gray)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Navigation */}
            <div className="bg-[var(--warm-beige)] p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Acceptance of Terms",
                  "Use of Services",
                  "Account Registration",
                  "Product Information",
                  "AR Technology",
                  "Payments & Pricing",
                  "Shipping & Returns",
                  "Privacy & Data"
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`#section-${i + 1}`}
                    className="flex items-center space-x-2 text-[var(--gold-accent)] hover:text-[var(--copper)] transition-colors"
                  >
                    <i className="fa-solid fa-circle text-xs"></i>
                    <span>{item}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="p-8 space-y-12">
              {[
                {
                  title: "Acceptance of Terms",
                  content: (
                    <>
                      <p>By accessing and using LuxeFurniture's website, mobile applications, and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
                      <p>If you do not agree to abide by the above, please do not use this service. These Terms of Service may be updated at any time without notice.</p>
                      <div className="bg-[var(--gold-accent)] bg-opacity-10 border-l-4 border-[var(--gold-accent)] p-4 rounded-r-lg">
                        <p className="text-[var(--charcoal)] font-medium">
                          <i className="fa-solid fa-info-circle text-[var(--gold-accent)] mr-2"></i>
                          By continuing to use our services after changes are posted, you agree to the revised terms.
                        </p>
                      </div>
                    </>
                  )
                },
                {
                  title: "Use of Services",
                  content: (
                    <>
                      <p>LuxeFurniture provides an e-commerce platform for purchasing premium furniture with integrated Augmented Reality (AR) features. Our services include:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Online furniture catalog browsing and purchasing</li>
                        <li>AR visualization technology for product placement</li>
                        <li>Customer account management and order tracking</li>
                        <li>Customer support and consultation services</li>
                      </ul>
                      <p>You agree to use our services only for lawful purposes and in accordance with these Terms of Service.</p>
                    </>
                  )
                },
                {
                  title: "Account Registration",
                  content: (
                    <>
                      <p>To access certain features of our service, you may be required to register for an account. When you register, you agree to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Maintain the security of your password and account</li>
                        <li>Accept responsibility for all activities under your account</li>
                      </ul>
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <p className="text-amber-800 font-medium">
                          <i className="fa-solid fa-shield-alt text-amber-600 mr-2"></i>
                          You are responsible for safeguarding your account credentials and all activities that occur under your account.
                        </p>
                      </div>
                    </>
                  )
                },
                {
                  title: "Product Information",
                  content: (
                    <>
                      <p>We strive to provide accurate product descriptions, dimensions, materials, and pricing. However:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Colors may vary due to monitor settings and lighting conditions</li>
                        <li>Dimensions are approximate and may have minor variations</li>
                        <li>Product availability is subject to change without notice</li>
                        <li>Prices are subject to change and do not include taxes or shipping</li>
                      </ul>
                      <p>We reserve the right to correct any errors in product information or pricing at any time.</p>
                    </>
                  )
                },
                {
                  title: "AR Technology",
                  content: (
                    <>
                      <p>Our Augmented Reality features are provided for visualization purposes only. By using AR features, you acknowledge:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>AR visualizations are approximations and may not be to exact scale</li>
                        <li>Lighting and environmental factors may affect AR accuracy</li>
                        <li>AR features require compatible devices and may not work on all platforms</li>
                        <li>We are not liable for decisions made based solely on AR visualizations</li>
                      </ul>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">
                          <i className="fa-solid fa-cube text-blue-600 mr-2"></i>
                          AR technology is provided as a convenience tool and should not replace professional measurement and consultation.
                        </p>
                      </div>
                    </>
                  )
                },
                {
                  title: "Payments & Pricing",
                  content: (
                    <>
                      <p>Payment terms and conditions:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>All prices are listed in USD and exclude taxes and shipping</li>
                        <li>Payment is due at the time of order placement</li>
                        <li>We accept major credit cards, PayPal, and other approved payment methods</li>
                        <li>Orders are subject to credit verification and approval</li>
                      </ul>
                      <p>We reserve the right to refuse or cancel orders for any reason, including but not limited to product availability, errors in pricing, or suspected fraudulent activity.</p>
                    </>
                  )
                },
                {
                  title: "Shipping & Returns",
                  content: (
                    <>
                      <p>Our shipping and return policies:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Shipping times and costs vary by location and product size</li>
                        <li>Risk of loss transfers to you upon delivery</li>
                        <li>Returns are accepted within 30 days of delivery in original condition</li>
                        <li>Custom or personalized items may not be returnable</li>
                      </ul>
                      <p>Detailed shipping and return information is available in our separate Shipping & Returns policy.</p>
                    </>
                  )
                },
                {
                  title: "Privacy & Data Protection",
                  content: (
                    <>
                      <p>Your privacy is important to us. Our data collection and use practices include:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Collection of personal information for order processing and account management</li>
                        <li>Use of cookies and analytics for website improvement</li>
                        <li>Protection of your data with industry-standard security measures</li>
                        <li>No sale of personal information to third parties</li>
                      </ul>
                      <p>For complete details, please review our Privacy Policy, which is incorporated by reference into these Terms of Service.</p>
                    </>
                  )
                }
              ].map((section, idx) => (
                <div key={idx} id={`section-${idx + 1}`} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-6 flex items-center">
                    <span className="bg-[var(--gold-accent)] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4">{idx + 1}</span>
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 bg-white rounded-xl p-8 shadow-sm text-center">
            <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-4">Questions About Our Terms?</h3>
            <p className="text-gray-600 mb-6">If you have any questions about these Terms of Service, please contact our legal team.</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-[var(--gold-accent)] hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <i className="fa-solid fa-envelope"></i>
                <span>Contact Legal Team</span>
              </button>
              <button className="border-2 border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)] hover:text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2">
                <i className="fa-solid fa-download"></i>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
