import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import LeadDetailView from '../components/LeadDetailView';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewingLeadId, setViewingLeadId] = useState<string | null>(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('Latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'New', source: 'Website' });
  const [formError, setFormError] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('sort', sortOrder);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);

      const res = await axios.get(`/api/leads?${params.toString()}`);
      setLeads(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotalLeads(res.data.meta.total);
    } catch (err: any) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, statusFilter, sourceFilter, sortOrder, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      params.append('sort', sortOrder);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);

      const response = await axios.get(`/api/leads/export?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`/api/leads/${id}`);
      fetchLeads();
    } catch (error) {
      alert('Failed to delete lead or insufficient permissions');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const leadToUpdate = leads.find(l => l._id === id);
      if (!leadToUpdate) return;
      
      const updatedData = { ...leadToUpdate, status: newStatus };
      await axios.put(`/api/leads/${id}`, updatedData);
      
      setLeads(leads.map(l => l._id === id ? { ...l, status: newStatus as any } : l));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const openModal = (lead?: Lead) => {
    setFormError('');
    if (lead) {
      setEditingLead(lead);
      setFormData({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
    } else {
      setEditingLead(null);
      setFormData({ name: '', email: '', status: 'New', source: 'Website' });
    }
    setIsModalOpen(true);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingLead) {
        await axios.put(`/api/leads/${editingLead._id}`, formData);
      } else {
        await axios.post('/api/leads', formData);
      }
      setIsModalOpen(false);
      fetchLeads();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error saving lead');
    }
  };

  const viewingLead = leads.find(l => l._id === viewingLeadId);

  if (viewingLead) {
    return (
      <>
        <LeadDetailView 
          lead={viewingLead}
          onBack={() => setViewingLeadId(null)}
          onEdit={() => openModal(viewingLead)}
          onDelete={() => handleDelete(viewingLead._id)}
          onStatusChange={(status) => handleStatusChange(viewingLead._id, status)}
        />
        {/* Modal for editing in detail view */}
        {isModalOpen && (
          <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-on-background/50 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <form onSubmit={handleSaveLead} className="p-lg flex flex-col gap-md">
                  <div className="flex justify-between items-center mb-sm">
                    <h3 className="font-headline-md text-headline-md font-bold text-on-background" id="modal-title">
                      Edit Lead
                    </h3>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                  </div>
                  {formError && (
                    <div className="bg-error-container text-on-error-container p-sm rounded-lg font-body-sm mb-xs">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-[40px]" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-[40px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-[40px]">
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Source</label>
                      <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-[40px]">
                        <option value="Website">Website</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Referral">Referral</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-md flex justify-end gap-sm">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-md py-[10px] rounded-lg border border-outline-variant text-on-surface font-title-md hover:bg-surface-container transition-colors h-[40px]">
                      Cancel
                    </button>
                    <button type="submit" className="px-md py-[10px] rounded-lg bg-primary text-on-primary font-title-md hover:opacity-90 transition-opacity shadow-sm h-[40px]">
                      Save Lead
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <div className="uppercase font-label-sm text-[10px] tracking-wider text-on-surface-variant font-bold md:hidden mb-1">
            Good Morning, {user?.name ? user.name.split(' ')[0] : 'Alex'}
          </div>
          <h1 className="font-headline-lg text-[24px] font-extrabold text-on-background">Lead Dashboard</h1>
          <p className="hidden md:block font-body-md text-body-md text-on-surface-variant mt-xs">Manage and track your incoming leads.</p>
        </div>
        <div className="hidden md:flex items-center space-x-sm">
          <button onClick={handleExportCSV} className="px-md py-[10px] rounded-lg border border-outline-variant text-on-surface font-title-md text-title-md hover:bg-surface-container transition-colors flex items-center h-[40px]">
            <span className="material-symbols-outlined mr-xs text-[18px]">download</span>
            Download CSV
          </button>
          <button onClick={() => openModal()} className="px-md py-[10px] rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-90 transition-opacity flex items-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] h-[40px]">
            <span className="material-symbols-outlined mr-xs text-[18px]">add</span>
            Add Lead
          </button>
        </div>
      </div>

      {/* Mobile Stats Cards */}
      <div className="grid grid-cols-2 gap-sm mb-lg md:hidden">
        <div className="bg-[#f2f0ff] rounded-[16px] p-md flex flex-col justify-center h-[100px]">
          <div className="text-primary font-bold text-[12px] mb-1">Active Leads</div>
          <div className="text-[#3b2b73] font-extrabold text-[28px]">{leads.length > 0 ? leads.length : '1,284'}</div>
        </div>
        <div className="bg-[#ecfdf5] rounded-[16px] p-md flex flex-col justify-center h-[100px]">
          <div className="text-secondary font-bold text-[12px] mb-1">Conversion Rate</div>
          <div className="text-[#065f46] font-extrabold text-[28px]">24.8%</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-sm md:hidden">
        <h2 className="font-title-md font-bold text-[16px]">Recent Leads</h2>
        <button className="text-primary font-bold text-[12px]">View All</button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="flex bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)] mb-lg flex-col xl:flex-row gap-md items-stretch xl:items-center">
        {/* Debounced Search */}
        <div className="w-full xl:w-1/3">
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Search Leads</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-xl pr-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-[40px]" 
              placeholder="Name or Email..." 
              type="text"
            />
          </div>
        </div>
        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md w-full xl:w-2/3">
          <div className="w-full">
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-[40px]"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Source</label>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-[40px]"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          <div className="w-full col-span-2 md:col-span-1 md:col-start-4 flex items-end justify-end">
            <button 
              onClick={() => setSortOrder(prev => prev === 'Latest' ? 'Oldest' : 'Latest')}
              className="w-full flex items-center justify-center space-x-xs bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors h-[40px]"
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span>{sortOrder === 'Latest' ? 'Latest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lead Table Card */}
      <div className="bg-surface-container-lowest md:rounded-2xl md:border border-outline-variant md:shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">Loading leads...</div>
        ) : error ? (
          <div className="p-8 text-center text-error font-body-md">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">No leads found.</div>
        ) : (
          <div className="w-full">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low/50">
                    <th className="px-lg py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Name</th>
                    <th className="px-lg py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Email</th>
                    <th className="px-lg py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Status</th>
                    <th className="px-lg py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Source</th>
                    <th className="px-lg py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Date</th>
                    <th className="px-lg py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                  {leads.map((lead) => {
                    let statusColors = 'bg-surface-variant text-on-surface-variant';
                    if (lead.status === 'New') statusColors = 'bg-primary/10 text-primary';
                    if (lead.status === 'Contacted') statusColors = 'bg-secondary/10 text-secondary';
                    if (lead.status === 'Qualified') statusColors = 'bg-tertiary/10 text-tertiary';
                    if (lead.status === 'Lost') statusColors = 'bg-error/10 text-error';

                    return (
                      <tr key={lead._id} onClick={() => setViewingLeadId(lead._id)} className="hover:bg-surface-container transition-colors group cursor-pointer">
                        <td className="px-lg py-md font-title-md text-title-md">{lead.name}</td>
                        <td className="px-lg py-md text-on-surface-variant">{lead.email}</td>
                        <td className="px-lg py-md">
                          <div className="relative inline-block w-32">
                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                              className={`appearance-none cursor-pointer w-full pl-7 pr-8 py-1.5 rounded-full font-label-sm text-label-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 ${statusColors} border border-transparent hover:border-outline-variant/30 transition-all`}
                            >
                              <option value="New" className="text-on-surface bg-surface-container-lowest font-semibold">New</option>
                              <option value="Contacted" className="text-on-surface bg-surface-container-lowest font-semibold">Contacted</option>
                              <option value="Qualified" className="text-on-surface bg-surface-container-lowest font-semibold">Qualified</option>
                              <option value="Lost" className="text-on-surface bg-surface-container-lowest font-semibold">Lost</option>
                            </select>
                            {/* Colored dot */}
                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${
                              lead.status === 'New' ? 'bg-primary' : 
                              lead.status === 'Contacted' ? 'bg-secondary' : 
                              lead.status === 'Qualified' ? 'bg-tertiary' : 
                              lead.status === 'Lost' ? 'bg-error' : 'bg-surface-variant'
                            }`}></div>
                            {/* Chevron icon */}
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none">expand_more</span>
                          </div>
                        </td>
                        <td className="px-lg py-md text-on-surface-variant">{lead.source}</td>
                        <td className="px-lg py-md text-on-surface-variant">{new Date(lead.createdAt).toLocaleDateString()}</td>
                        <td className="px-lg py-md text-right">
                          <button onClick={(e) => { e.stopPropagation(); openModal(lead); }} className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          {user?.role === 'Admin' && (
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(lead._id); }} className="text-on-surface-variant hover:text-error transition-colors p-xs rounded-full hover:bg-surface-container-high ml-xs">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col space-y-sm bg-background p-sm">
              {leads.map((lead) => {
                let statusBg = 'bg-surface-variant text-on-surface-variant';
                let iconColorClass = 'text-primary';
                let iconBgClass = 'bg-primary/10';
                
                if (lead.status === 'New') {
                  statusBg = 'bg-primary-container/20 text-primary border border-primary/20';
                  iconColorClass = 'text-primary';
                  iconBgClass = 'bg-primary-container/20';
                }
                if (lead.status === 'Contacted') {
                  statusBg = 'bg-[#ecfdf5] text-secondary border border-secondary/20';
                  iconColorClass = 'text-secondary';
                  iconBgClass = 'bg-[#ecfdf5]';
                }
                if (lead.status === 'Qualified') {
                  statusBg = 'bg-[#f0fdf4] text-[#166534] border border-[#166534]/20';
                  iconColorClass = 'text-[#166534]';
                  iconBgClass = 'bg-[#f0fdf4]';
                }
                if (lead.status === 'Lost') {
                  statusBg = 'bg-[#fef2f2] text-error border border-error/20';
                  iconColorClass = 'text-error';
                  iconBgClass = 'bg-[#fef2f2]';
                }

                // Render specific icons based on source
                let IconName = 'person';
                if (lead.source === 'Website') IconName = 'web';
                if (lead.source === 'Referral') IconName = 'groups';
                if (lead.source === 'Cold Email') IconName = 'alternate_email';

                return (
                  <div key={lead._id} className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex items-center justify-between cursor-pointer" onClick={() => setViewingLeadId(lead._id)}>
                    <div className="flex items-center gap-md">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} ${iconColorClass}`}>
                        <span className="material-symbols-outlined text-[24px]">{IconName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[14px] text-on-surface">{lead.name}</span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">Source: {lead.source}</span>
                      </div>
                    </div>
                    
                    <div className="relative inline-block shrink-0">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`appearance-none cursor-pointer pl-2 pr-6 py-1 rounded-full text-[10px] font-bold outline-none ${statusBg}`}
                        >
                          <option value="New">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Lost">Lost</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">expand_more</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Pagination */}
        <div className="border-t border-outline-variant px-lg py-sm flex items-center justify-between bg-surface-container-lowest">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Showing <span className="font-title-md text-on-surface">{(page - 1) * 10 + 1}</span> to <span className="font-title-md text-on-surface">{Math.min(page * 10, totalLeads)}</span> of <span className="font-title-md text-on-surface">{totalLeads}</span> leads
          </span>
          <div className="flex items-center space-x-xs">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-sm py-xs border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="text-on-surface-variant font-label-md px-sm">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-sm py-xs border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <button 
        onClick={() => openModal()}
        className="md:hidden fixed bottom-[84px] right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:opacity-90 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-on-background/50 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-surface-container-lowest rounded-2xl border border-outline-variant text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSaveLead}>
                <div className="px-lg pt-lg pb-md">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-lg" id="modal-title">
                    {editingLead ? 'Edit Lead' : 'Add Lead'}
                  </h3>
                  {formError && <div className="mb-4 text-sm text-on-error-container bg-error-container p-3 rounded-lg font-body-md">{formError}</div>}
                  <div className="space-y-md">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Status</label>
                      <select
                        className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Source</label>
                      <select
                        className="w-full bg-surface border border-outline-variant rounded-lg px-md py-[8px] font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                      >
                        <option value="Website">Website</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Referral">Referral</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container px-lg py-md flex flex-row-reverse gap-sm border-t border-outline-variant">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-lg border border-transparent px-lg py-[8px] bg-primary font-title-md text-title-md text-on-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex justify-center rounded-lg border border-outline-variant px-lg py-[8px] bg-surface-container-lowest font-title-md text-title-md text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
