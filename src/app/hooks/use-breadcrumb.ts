import { useMemo } from "react";
import { useLocation } from "react-router";

export type BreadcrumbItem = {
    link: string;
    name: string;
};

export function useBreadcrumb() {
    const location = useLocation();
    
    return useMemo(() => {
        const names = location.pathname.split('/').filter(Boolean);
        
        return names.map<BreadcrumbItem>((name, i, names) => ({
            name: name,
            link: `/${names.slice(0, i + 1).join('/')}`,
        }));        
    }, [location.key]);
}
