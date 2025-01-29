import React from 'react';
import { FileText, ClipboardList, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

//Del panel de Director
export function ActionButton ({to, icon: Icon, title, description}){
  return(
    <Link 
      to={to}
      className=" flex flex-col items-center gap-3 rounded-lg border-2 border-clrNavbar bg-white p-3 text-center text-clrNavbar
                  duration-300 transition-colors transition-transform	 hover:bg-clrNavbar hover:text-white hover:scale-[1.02]"
    >
      <Icon className="h-12 w-12" />
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{description}</p>
      </div>
    </Link>
  );
}