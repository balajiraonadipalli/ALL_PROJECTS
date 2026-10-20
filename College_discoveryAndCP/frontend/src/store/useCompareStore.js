import { create } from 'zustand';

export const useCompareStore = create((set, get) => ({
    compareList: [],
    addCollege: (college) => {
        const { compareList } = get();
        if (compareList.length >= 3) {
            alert('You can only compare up to 3 colleges');
            return;
        }
        if (!compareList.find(c => c._id === college._id)) {
            set({ compareList: [...compareList, { _id: college._id, name: college.name, images: college.images, slug: college.slug }] });
        }
    },
    removeCollege: (id) => {
        set(state => ({
            compareList: state.compareList.filter(c => c._id !== id)
        }));
    },
    clearCompare: () => set({ compareList: [] })
}));
