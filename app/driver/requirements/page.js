import { Shield, Car, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DriverRequirements() {
  const requirements = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Valid Driver\'s License',
      description: 'Must have a valid driver\'s license for at least 3 years'
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Vehicle Requirements',
      description: 'Vehicle must be less than 10 years old and pass inspection'
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: 'Background Check',
      description: 'Must pass background check and have clean driving record'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Driver Requirements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {requirements.map((req, index) => (
          <Card key={index} className="p-6">
            <div className="text-primary mb-4">{req.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{req.title}</h3>
            <p className="text-gray-600">{req.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-primary text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Join our network of professional drivers and start earning.</p>
        <Button variant="secondary">Apply Now</Button>
      </Card>
    </div>
  )
}