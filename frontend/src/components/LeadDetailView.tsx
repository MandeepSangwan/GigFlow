import React, { useState } from 'react';
import { Lead } from '../pages/Dashboard'; // Need to export Lead from Dashboard or define it here

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

const LeadDetailView: React.FC<LeadDetailViewProps> = ({ lead, onBack, onEdit, onDelete, onStatusChange }) => {
  const [note, setNote] = useState('');

  let statusBg = 'bg-surface-variant text-on-surface-variant';
  if (lead.status === 'New') statusBg = 'bg-primary-container/20 text-primary border border-primary/20';
  if (lead.status === 'Contacted') statusBg = 'bg-[#ecfdf5] text-secondary border border-secondary/20';
  if (lead.status === 'Qualified') statusBg = 'bg-[#f0fdf4] text-[#166534] border border-[#166534]/20';
  if (lead.status === 'Lost') statusBg = 'bg-[#fef2f2] text-error border border-error/20';

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-sm mb-lg">
        <button onClick={onBack} className="flex items-center text-on-surface-variant font-label-sm text-[12px] hover:text-primary transition-colors self-start">
          <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
          Back to Leads
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-md">
              <h1 className="font-headline-lg text-[24px] md:text-[28px] font-extrabold text-on-background">{lead.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusBg}`}>
                {lead.status}
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant mt-1 text-[14px]">
              VP of Operations at TechCorp Inc. {/* Hardcoded placeholder for now since we don't have company in schema */}
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <button onClick={onEdit} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 border border-outline-variant rounded-lg font-title-md text-[14px] hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span> Edit Lead
            </button>
            <button onClick={onDelete} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 border border-error/30 text-error rounded-lg font-title-md text-[14px] hover:bg-error-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">delete</span> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 flex flex-col gap-lg">
          {/* Contact Information */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md md:p-lg">
            <h2 className="font-headline-md text-[18px] font-bold mb-lg">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-lg gap-x-md">
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</div>
                <div className="flex items-center gap-2 text-on-surface font-body-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                  {lead.email}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Phone</div>
                <div className="flex items-center gap-2 text-on-surface font-body-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">call</span>
                  +1 (555) 019-8273
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Company</div>
                <div className="flex items-center gap-2 text-on-surface font-body-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">domain</span>
                  TechCorp Inc.
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Source</div>
                <div className="flex items-center gap-2 text-on-surface font-body-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">language</span>
                  {lead.source}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Created Date</div>
                <div className="flex items-center gap-2 text-on-surface font-body-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_today</span>
                  {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lead Score</div>
                <div className="flex items-center gap-2 text-on-surface font-body-md">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  85 / 100
                </div>
              </div>
            </div>
          </div>

          {/* Sales Notes */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md md:p-lg mb-lg">
            <h2 className="font-headline-md text-[18px] font-bold mb-lg">Sales Notes</h2>
            
            <div className="bg-primary/5 rounded-xl p-md mb-md">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                    JD
                  </div>
                  <span className="font-bold text-[14px]">John Doe</span>
                </div>
                <span className="text-[11px] text-on-surface-variant font-medium">Oct 25, 2:30 PM</span>
              </div>
              <p className="text-[13px] text-on-surface font-medium leading-relaxed">
                Had a great initial call. {lead.name.split(' ')[0]} is very interested in the enterprise tier. They are currently evaluating competitors but prefer our integration capabilities.
              </p>
            </div>

            <div className="relative mt-md">
              <textarea 
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Leave feedback or note..."
                className="w-full bg-surface border border-outline-variant rounded-xl p-md text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px] resize-y"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button 
                  onClick={() => { if(note) { alert('Note added!'); setNote(''); } }}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-[13px] hover:bg-primary/90 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md md:p-lg lg:h-fit">
          <h2 className="font-headline-md text-[18px] font-bold mb-lg">Activity Timeline</h2>
          <div className="relative border-l border-outline-variant/50 ml-3 space-y-6 pb-4">
            
            {/* Timeline Item 1 */}
            <div className="relative pl-6">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Today, 10:15 AM</div>
              <div className="font-bold text-[14px] text-on-surface mb-1">Status changed to {lead.status}</div>
              <div className="text-[13px] text-on-surface-variant font-medium">Automated rule triggered by lead score &gt; 80.</div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-6">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Oct 25, 2:30 PM</div>
              <div className="font-bold text-[14px] text-on-surface mb-1">Discovery Call Completed</div>
              <div className="text-[13px] text-on-surface-variant font-medium">Logged by John Doe.</div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-6">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Oct 24, 9:00 AM</div>
              <div className="font-bold text-[14px] text-on-surface mb-1">Email Opened</div>
              <div className="text-[13px] text-on-surface-variant font-medium">"Welcome to Smart Leads" campaign.</div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative pl-6">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, 8:45 AM</div>
              <div className="font-bold text-[14px] text-on-surface mb-1">Lead Created</div>
              <div className="text-[13px] text-on-surface-variant font-medium">Via {lead.source} landing page.</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailView;
