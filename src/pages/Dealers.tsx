import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const dealers = [
  { id: 1, name: 'TechWorld Electronics', country: 'India', city: 'Mumbai', address: '123 Marine Drive, Mumbai 400001', phone: '+91 22 1234 5678', email: 'mumbai@techworld.in' },
  { id: 2, name: 'Digital Hub', country: 'India', city: 'Delhi', address: '456 Connaught Place, New Delhi 110001', phone: '+91 11 2345 6789', email: 'delhi@digitalhub.in' },
  { id: 3, name: 'Gadget Zone', country: 'India', city: 'Bangalore', address: '789 MG Road, Bangalore 560001', phone: '+91 80 3456 7890', email: 'blr@gadgetzone.in' },
  { id: 4, name: 'Smart Systems', country: 'India', city: 'Chennai', address: '321 Anna Salai, Chennai 600002', phone: '+91 44 4567 8901', email: 'chennai@smartsystems.in' },
  { id: 5, name: 'Tech Paradise', country: 'USA', city: 'New York', address: '100 5th Avenue, NY 10011', phone: '+1 212 555 0100', email: 'nyc@techparadise.com' },
  { id: 6, name: 'Silicon Store', country: 'USA', city: 'San Francisco', address: '200 Market Street, SF 94102', phone: '+1 415 555 0200', email: 'sf@siliconstore.com' },
  { id: 7, name: 'Digital Dreams', country: 'UK', city: 'London', address: '50 Oxford Street, London W1D 1BF', phone: '+44 20 7123 4567', email: 'london@digitaldreams.co.uk' },
  { id: 8, name: 'Euro Electronics', country: 'Germany', city: 'Berlin', address: 'Friedrichstraße 123, 10117 Berlin', phone: '+49 30 1234567', email: 'berlin@euroelectronics.de' },
  { id: 9, name: 'Tech Oasis', country: 'UAE', city: 'Dubai', address: 'Dubai Mall, Downtown Dubai', phone: '+971 4 123 4567', email: 'dubai@techoasis.ae' },
  { id: 10, name: 'Asia Tech', country: 'Singapore', city: 'Singapore', address: '10 Orchard Road, Singapore 238826', phone: '+65 6123 4567', email: 'sg@asiatech.com' },
];

const countries = [...new Set(dealers.map(d => d.country))];

export default function Dealers() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const filteredDealers = selectedCountry === 'all' 
    ? dealers 
    : dealers.filter(d => d.country === selectedCountry);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Authorized Dealers</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find a NexaTech authorized dealer near you. All our dealers offer genuine products with full warranty support.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium">Filter by Country:</span>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">
              Showing {filteredDealers.length} dealer{filteredDealers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Dealers Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="p-4 text-left font-medium">Dealer Name</th>
                    <th className="p-4 text-left font-medium">Location</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Address</th>
                    <th className="p-4 text-left font-medium hidden lg:table-cell">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDealers.map(dealer => (
                    <tr key={dealer.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{dealer.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{dealer.city}, {dealer.country}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{dealer.city}, {dealer.country}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-muted-foreground">{dealer.address}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-primary" />
                            <span>{dealer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3 text-primary" />
                            <span>{dealer.email}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards for contact info */}
          <div className="mt-8 lg:hidden space-y-4">
            <h3 className="font-heading font-semibold">Contact Details</h3>
            {filteredDealers.map(dealer => (
              <div key={dealer.id} className="bg-card rounded-xl border border-border p-4">
                <h4 className="font-medium mb-2">{dealer.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {dealer.address}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    {dealer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    {dealer.email}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Become a Dealer CTA */}
          <div className="mt-16 bg-card rounded-2xl border border-border p-8 text-center">
            <Globe className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2">Become a Dealer</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Interested in becoming an authorized NexaTech dealer? Contact our partnership team for more information.
            </p>
            <a href="mailto:dealers@nexatech.com" className="text-primary hover:underline">
              dealers@nexatech.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
