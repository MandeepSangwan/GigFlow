import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your account preferences and configurations.</p>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden max-w-3xl">
        <div className="p-xl border-b border-outline-variant">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Profile Information</h3>
          <div className="space-y-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">Name</label>
              <input type="text" disabled value={user?.name || ''} className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface-variant opacity-70" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">Email</label>
              <input type="email" disabled value={user?.email || ''} className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface-variant opacity-70" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">Role</label>
              <input type="text" disabled value={user?.role || ''} className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface-variant opacity-70" />
            </div>
          </div>
          <div className="mt-md">
            <button className="px-lg py-[8px] bg-primary text-on-primary rounded-lg font-title-md text-title-md hover:bg-primary/90 transition-colors">
              Update Profile
            </button>
          </div>
        </div>

        <div className="p-xl">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">System Preferences</h3>
          <div className="flex items-center justify-between py-sm border-b border-outline-variant/50">
            <div>
              <p className="font-title-md text-title-md text-on-surface">Email Notifications</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Receive alerts when new leads are added.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-sm">
            <div>
              <p className="font-title-md text-title-md text-on-surface">Two-Factor Authentication</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Enhance account security.</p>
            </div>
            <button className="px-md py-[6px] border border-outline-variant text-on-surface rounded-lg font-title-sm text-title-sm hover:bg-surface-container transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
