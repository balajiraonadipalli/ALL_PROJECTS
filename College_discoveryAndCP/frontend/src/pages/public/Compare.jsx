import React, { useState, useEffect } from 'react';
import { useCompareStore } from '../../store/useCompareStore';
import { compareCollegesApi } from '../../services/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Compare = () => {
    const { compareList, removeCollege } = useCompareStore();
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (compareList.length < 2) {
            navigate('/');
            return;
        }

        const load = async () => {
            try {
                const ids = compareList.map(c => c._id);
                const data = await compareCollegesApi(ids);
                setColleges(data);
            } catch {
                // Mock for demo if backend isn't running
                setColleges([
                    { _id: compareList[0]?._id, slug: compareList[0]?.slug, name: compareList[0]?.name || 'Demo Tech', ranking: 3, location: 'San Francisco, CA', placement: { averagePackage: 12.5, highestPackage: 45 }, courses: [{ fees: 200000 }] },
                    { _id: compareList[1]?._id, slug: compareList[1]?.slug, name: compareList[1]?.name || 'Global Business', ranking: 5, location: 'New York, NY', placement: { averagePackage: 15.0, highestPackage: 50 }, courses: [{ fees: 350000 }] },
                    ...(compareList[2] ? [{ _id: compareList[2]?._id, slug: compareList[2]?.slug, name: compareList[2]?.name || 'State University', ranking: 1, location: 'Austin, TX', placement: { averagePackage: 8.5, highestPackage: 25 }, courses: [{ fees: 150000 }] }] : [])
                ]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [compareList, navigate]);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

    const getBest = (metric, type = 'high') => {
        if (!colleges.length) return null;
        let values = colleges.map(c => {
            if (metric === 'ranking') return c.ranking || 9999;
            if (metric === 'avgPackage') return c.placement?.averagePackage || 0;
            if (metric === 'highPackage') return c.placement?.highestPackage || 0;
            if (metric === 'fees') return c.courses?.[0]?.fees || 9999999;
            return 0;
        });

        return type === 'high' ? Math.max(...values) : Math.min(...values);
    };

    const bestRanking = getBest('ranking', 'low');
    const bestAvgPackage = getBest('avgPackage', 'high');
    const bestHighPackage = getBest('highPackage', 'high');
    const bestFees = getBest('fees', 'low');

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
                <ArrowLeft size={18} /> Back to Search
            </button>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Compare Colleges</h1>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="p-6 bg-gray-50 w-1/4 border-b border-gray-200 border-r text-gray-500 font-bold uppercase tracking-wider text-sm align-bottom">
                                    Parameters
                                </th>
                                {colleges.map(c => (
                                    <th key={c._id} className="p-8 bg-white border-b border-gray-200 border-r last:border-r-0 w-1/4 align-top">
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{c.name}</h3>
                                            <p className="text-sm font-bold text-gray-400 mb-5 uppercase tracking-wider">{c.location}</p>
                                            <button onClick={() => removeCollege(c._id)} className="text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">Remove from list</button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-6 font-bold text-gray-700 bg-gray-50 border-r border-gray-100">National Ranking</td>
                                {colleges.map(c => {
                                    const isBest = (c.ranking || 9999) === bestRanking && c.ranking > 0;
                                    return (
                                        <td key={c._id} className={`p-6 border-r border-gray-100 last:border-r-0 text-center ${isBest ? 'bg-green-50/30' : ''}`}>
                                            <div className="flex flex-col items-center justify-center gap-2 mt-1">
                                                <span className={`text-2xl font-black ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {c.ranking ? `#${c.ranking}` : 'N/A'}
                                                </span>
                                                {isBest && <span className="text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full shadow-sm">Best Rank</span>}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-6 font-bold text-gray-700 bg-gray-50 border-r border-gray-100">Average Package (LPA)</td>
                                {colleges.map(c => {
                                    const val = c.placement?.averagePackage || 0;
                                    const isBest = val === bestAvgPackage && val > 0;
                                    return (
                                        <td key={c._id} className={`p-6 border-r border-gray-100 last:border-r-0 text-center ${isBest ? 'bg-green-50/30' : ''}`}>
                                            <div className="flex flex-col items-center justify-center gap-2 mt-1">
                                                <span className={`text-2xl font-black ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {val > 0 ? val : 'N/A'}
                                                </span>
                                                {isBest && <span className="text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full shadow-sm">Highest</span>}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-6 font-bold text-gray-700 bg-gray-50 border-r border-gray-100">Highest Package (LPA)</td>
                                {colleges.map(c => {
                                    const val = c.placement?.highestPackage || 0;
                                    const isBest = val === bestHighPackage && val > 0;
                                    return (
                                        <td key={c._id} className={`p-6 border-r border-gray-100 last:border-r-0 text-center ${isBest ? 'bg-green-50/30' : ''}`}>
                                            <div className="flex flex-col items-center justify-center gap-2 mt-1">
                                                <span className={`text-2xl font-black ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {val > 0 ? val : 'N/A'}
                                                </span>
                                                {isBest && <span className="text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full shadow-sm">Highest</span>}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-6 font-bold text-gray-700 bg-gray-50 border-r border-gray-100">Starting Fees / Year</td>
                                {colleges.map(c => {
                                    const val = c.courses?.[0]?.fees || 0;
                                    const isBest = val === bestFees && val > 0;
                                    return (
                                        <td key={c._id} className={`p-6 border-r border-gray-100 last:border-r-0 text-center ${isBest ? 'bg-green-50/30' : ''}`}>
                                            <div className="flex flex-col items-center justify-center gap-2 mt-1">
                                                <span className={`text-2xl font-black ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {val > 0 ? `₹${val.toLocaleString()}` : 'N/A'}
                                                </span>
                                                {isBest && <span className="text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full shadow-sm">Affordable</span>}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr>
                                <td className="p-6 bg-gray-50 border-t-2 border-r border-gray-200"></td>
                                {colleges.map(c => (
                                    <td key={c._id} className="p-6 text-center border-t-2 border-r border-gray-200 last:border-r-0 bg-gray-50/50">
                                        <Link to={`/college/${c.slug || c._id}`} className="inline-block px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-transform active:scale-95 shadow-md">
                                            View Details
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Compare;
