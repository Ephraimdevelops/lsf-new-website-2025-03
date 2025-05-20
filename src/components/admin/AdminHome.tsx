
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Search } from 'lucide-react';

const AdminHome = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-panton">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Total News Items</CardTitle>
            <FileText size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">+2 in the last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Published Programs</CardTitle>
            <Users size={16} className="text-secondary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">All programs active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-calibri">Publications</CardTitle>
            <FileText size={16} className="text-secondary-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 mt-1 font-calibri">1 new this month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-panton">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium font-calibri">New Publication Added</div>
                  <div className="text-sm text-gray-500 font-calibri">Annual Report 2023 was published</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">2 days ago</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-secondary-teal/10 p-2 rounded-full">
                  <FileText size={16} className="text-secondary-teal" />
                </div>
                <div>
                  <div className="font-medium font-calibri">News Article Updated</div>
                  <div className="text-sm text-gray-500 font-calibri">Women's rights workshop article was edited</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">3 days ago</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-secondary-green/10 p-2 rounded-full">
                  <Users size={16} className="text-secondary-green" />
                </div>
                <div>
                  <div className="font-medium font-calibri">Program Updated</div>
                  <div className="text-sm text-gray-500 font-calibri">Legal Empowerment program details modified</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-calibri">5 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
