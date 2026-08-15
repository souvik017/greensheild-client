export const CATEGORIES = [
  { id: 'electrical-electronics', labelKey: 'categories.electrical-electronics', icon: 'Zap' },
  { id: 'pest-control', labelKey: 'categories.pest-control', icon: 'Bug' },
  { id: 'home-repair', labelKey: 'categories.home-repair', icon: 'Hammer' },
  { id: 'cleaning', labelKey: 'categories.cleaning', icon: 'Sparkles' },
  { id: 'gardening', labelKey: 'categories.gardening', icon: 'Flower2' },
  { id: 'interior-furniture', labelKey: 'categories.interior-furniture', icon: 'Sofa' },
  { id: 'shifting-logistics', labelKey: 'categories.shifting-logistics', icon: 'Truck' },
  { id: 'health-wellness', labelKey: 'categories.health-wellness', icon: 'HeartPulse' },
  { id: 'salon-beauty', labelKey: 'categories.salon-beauty', icon: 'Scissors' },
  { id: 'home-helpers', labelKey: 'categories.home-helpers', icon: 'Users' },
  { id: 'maintenance', labelKey: 'categories.maintenance', icon: 'Settings' }
];

export const POPULAR_SEARCHES = ['Pest Control', 'AC Service', 'Electrician', 'Home Cleaning', 'Plumber'];

export const STATUS_COLORS = {
  active: 'bg-success text-white',
  inactive: 'bg-border text-text-muted',
  comingSoon: 'bg-warning text-white',
  locked: 'bg-warning text-white',
  disabled: 'bg-border text-text-muted',
  new: 'bg-primary-600 text-white',
  'follow-up': 'bg-warning text-white',
  confirmed: 'bg-success text-white',
  cancelled: 'bg-danger text-white',
  completed: 'bg-primary-600 text-white',
  scheduled: 'bg-primary-600 text-white',
  'in-progress': 'bg-warning text-white',
  'no-show': 'bg-danger text-white',
  issued: 'bg-primary-600 text-white',
  paid: 'bg-success text-white'
};

export const ENQUIRY_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'follow-up', label: 'Follow Up Later' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const APPOINTMENT_STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'no-show', label: 'No Show' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const INVOICE_STATUSES = [
  { value: 'issued', label: 'Issued' },
  { value: 'paid', label: 'Paid' },
];

export const STATS_DATA = {
  customers: '10K+',
  professionals: '500+',
  services: '100+',
  cities: '50+',
  rating: '4.8/5'
};
