import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Image as ImageIcon, Save, CheckCircle, GripVertical, AlertCircle, X, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '../../utils/cn';

const CollegeEditor = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [collegeId, setCollegeId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '', description: '', location: '', ranking: 0, status: 'Draft',
            images: [],
            courses: [{ name: '', duration: '', fees: '', availableSeats: '' }],
            placement: { averagePackage: '', highestPackage: '', topRecruiters: '' },
            eligibility: ''
        }
    });

    const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({ control, name: 'courses' });

    const [imagePreview, setImagePreview] = useState('');
    const images = watch('images') || [];
    const status = watch('status');

    useEffect(() => {
        if (slug) {
            const loadCollege = async () => {
                try {
                    const { fetchCollegeBySlug } = await import('../../services/api');
                    const data = await fetchCollegeBySlug(slug);
                    setCollegeId(data._id);
                    if (data.placement && Array.isArray(data.placement.topRecruiters)) {
                        data.placement.topRecruiters = data.placement.topRecruiters.join(', ');
                    }
                    if (!data.courses || data.courses.length === 0) {
                        data.courses = [{ name: '', duration: '', fees: '', availableSeats: '' }];
                    }
                    reset(data);
                } catch (error) {
                    showToast("Error loading college data", "error");
                }
            };
            loadCollege();
        }
    }, [slug, reset]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddImage = () => {
        if (imagePreview.trim()) {
            setValue('images', [...images, imagePreview.trim()]);
            setImagePreview('');
        }
    };

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const processedData = {
                ...data,
                ranking: data.ranking === '' ? 0 : Number(data.ranking),
                courses: data.courses.map(c => ({
                    ...c,
                    fees: c.fees === '' ? 0 : Number(c.fees),
                    availableSeats: c.availableSeats === '' ? undefined : Number(c.availableSeats)
                })),
                placement: {
                    ...data.placement,
                    averagePackage: data.placement.averagePackage === '' ? undefined : Number(data.placement.averagePackage),
                    highestPackage: data.placement.highestPackage === '' ? undefined : Number(data.placement.highestPackage),
                    topRecruiters: data.placement.topRecruiters ? String(data.placement.topRecruiters).split(',').map(s => s.trim()).filter(Boolean) : []
                }
            };

            const { createCollege, updateCollege } = await import('../../services/api');
            if (collegeId) await updateCollege(collegeId, processedData);
            else await createCollege(processedData);

            showToast(`College ${collegeId ? 'updated' : 'created'} successfully!`);
            if (!collegeId) setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to save college", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

    return (
        <div className="max-w-4xl mx-auto pb-24 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={cn(
                            "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border",
                            toast.type === 'error' ? "bg-red-500/90 text-white border-red-600/50" : "bg-emerald-500/90 text-white border-emerald-600/50"
                        )}
                    >
                        {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                        <span className="font-semibold">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={containerVariants} initial="hidden" animate="show">
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white/50 p-4 rounded-2xl backdrop-blur-xl border border-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{collegeId ? 'Edit College' : 'New College'}</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Configure details, courses, and placement stats.</p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Section 1: Overview */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60 transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800">1. Core Information</h2>
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                                <button type="button" onClick={() => setValue('status', 'Draft')} className={cn("px-4 py-1.5 text-sm font-bold rounded-lg transition-all", status === 'Draft' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>Draft</button>
                                <button type="button" onClick={() => setValue('status', 'Published')} className={cn("px-4 py-1.5 text-sm font-bold rounded-lg transition-all", status === 'Published' ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20" : "text-slate-500 hover:text-slate-700")}>Published</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">College Name <span className="text-red-500">*</span></label>
                                <input {...register('name', { required: true })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Stanford University" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea {...register('description')} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none" placeholder="Detailed description about the college..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location <span className="text-red-500">*</span></label>
                                <input {...register('location', { required: true })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="City, State" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">National Ranking</label>
                                <input type="number" {...register('ranking')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. 1" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Section 2: Images */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">2. Media Gallery</h2>
                        <div className="flex gap-3 mb-6">
                            <div className="relative flex-1">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" value={imagePreview} onChange={(e) => setImagePreview(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Paste image URL here and press Enter..." />
                            </div>
                            <button type="button" onClick={handleAddImage} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm active:scale-95">Add</button>
                        </div>

                        <LayoutGroup>
                            <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <AnimatePresence>
                                    {images.map((img, idx) => (
                                        <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} key={img + idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-50">
                                            <img src={img} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setValue('images', images.filter((_, i) => i !== idx))} className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </LayoutGroup>
                    </motion.div>

                    {/* Section 3: Courses */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">3. Available Courses</h2>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => appendCourse({ name: '', duration: '', fees: '', availableSeats: '' })} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                                <Plus size={18} /> Add Course
                            </motion.button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {courseFields.map((field, index) => (
                                    <motion.div key={field.id} initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95, margin: 0 }} transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} className="p-5 border border-slate-200 rounded-2xl bg-[#FAFAFA] relative flex flex-col md:flex-row gap-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 focus-within:bg-white transition-all group">
                                        <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-slate-400">
                                            <GripVertical size={16} />
                                        </div>

                                        <div className="flex-1 md:pl-6">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Course Name</label>
                                            <input {...register(`courses.${index}.name`, { required: true })} className="w-full px-0 py-1 bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium" placeholder="B.Tech Computer Science" />
                                        </div>
                                        <div className="w-full md:w-32">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration</label>
                                            <input {...register(`courses.${index}.duration`)} className="w-full px-0 py-1 bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium" placeholder="4 Years" />
                                        </div>
                                        <div className="w-full md:w-32">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fees/Year</label>
                                            <input type="number" {...register(`courses.${index}.fees`, { required: true })} className="w-full px-0 py-1 bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium" placeholder="150000" />
                                        </div>
                                        <div className="w-full md:w-24">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Seats</label>
                                            <input type="number" {...register(`courses.${index}.availableSeats`)} className="w-full px-0 py-1 bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium" placeholder="120" />
                                        </div>

                                        <button type="button" onClick={() => removeCourse(index)} className="mt-4 md:mt-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all self-end md:self-center opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-white shadow-sm border border-slate-100 md:border-transparent md:shadow-none md:bg-transparent">
                                            <X size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Section 4: Placement & Eligibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">4. Placement Stats</h2>
                            <div className="space-y-5">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Avg Package <span className="text-slate-400 font-normal">(LPA)</span></label>
                                        <input type="number" step="0.01" {...register('placement.averagePackage')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="6.5" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">High Package <span className="text-slate-400 font-normal">(LPA)</span></label>
                                        <input type="number" step="0.01" {...register('placement.highestPackage')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="42" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Top Recruiters <span className="text-slate-400 font-normal">(Comma Separated)</span></label>
                                    <input {...register('placement.topRecruiters')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Google, Microsoft, Amazon" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-200/60 flex flex-col">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">5. Eligibility</h2>
                            <textarea {...register('eligibility')} rows={5} className="w-full flex-1 min-h-[160px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none" placeholder="Requirements for admission..." />
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="fixed bottom-0 left-0 lg:left-72 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-30 flex justify-end gap-4">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSaving} className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save College'}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default CollegeEditor;
