
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function AccountSettings() {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-4">Account Settings</h2>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border rounded-md">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-muted-foreground text-sm">
              Receive email alerts for price drops and game reminders
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <label htmlFor="notifications" className="text-sm">
              {true ? "Enabled" : "Disabled"}
            </label>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border rounded-md">
          <div>
            <h3 className="font-medium">Price Display Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure how ticket prices are displayed
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Price Display Settings</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Currency</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="w-16">USD</Button>
                    <Button variant="ghost" size="sm" className="w-16">EUR</Button>
                    <Button variant="ghost" size="sm" className="w-16">CAD</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Include Fees</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="include-fees" defaultChecked />
                    <label htmlFor="include-fees" className="text-sm">
                      Show prices with fees included
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Price Change Display</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Percentage</Button>
                    <Button variant="ghost" size="sm">Absolute</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
