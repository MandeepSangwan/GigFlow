import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';

interface Lead {
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

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Lead Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage and track your incoming leads.</p>
        </div>
        <div className="flex items-center space-x-sm">
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

      {/* Advanced Filter Bar */}
      <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)] mb-lg flex flex-col xl:flex-row gap-md items-end xl:items-center">
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
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">Loading leads...</div>
        ) : error ? (
          <div className="p-8 text-center text-error font-body-md">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">No leads found.</div>
        ) : (
          <div className="overflow-x-auto w-full">
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
                    <tr key={lead._id} className="hover:bg-surface-container transition-colors group">
                      <td className="px-lg py-md font-title-md text-title-md">{lead.name}</td>
                      <td className="px-lg py-md text-on-surface-variant">{lead.email}</td>
                      <td className="px-lg py-md">
                        <div className="relative inline-block">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-label-sm text-label-sm ${statusColors}`}>
                            {lead.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant">{lead.source}</td>
                      <td className="px-lg py-md text-on-surface-variant">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-lg py-md text-right">
                        <button onClick={() => openModal(lead)} className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        {user?.role === 'Admin' && (
                          <button onClick={() => handleDelete(lead._id)} className="text-on-surface-variant hover:text-error transition-colors p-xs rounded-full hover:bg-surface-container-high ml-xs">
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
