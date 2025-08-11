import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Home, List, BarChart2, User as UserIcon, ShieldCheck, Sun, Settings as SettingsIcon, Users, Smile, Code2, LayoutGrid, Wand2, Shield, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import AIAssistantModal from './AIAssistantModal';
import { useUserStore } from '../stores/useUserStore';
import SubscriptionGate from './SubscriptionGate';
import PlanBadge from './PlanBadge';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Dashboard from '../pages/Dashboard';
import QuizzesList from '../pages/QuizzesList';
import QuizView from '../pages/QuizView';
import Focus from '../pages/Focus';
import Leaderboard from '../pages/Leaderboard';
import { Settings } from '../pages/Settings';
import Portfolio from '../pages/Portfolio';
import BillingTab from './BillingTab';
import SquadsList from '../pages/SquadsList';
import SquadView from '../pages/SquadView';
import Wellness from '../pages/Wellness';
import CodingArena from '../pages/CodingArena';
import AccountTab from './AccountTab';
import Agents from '../pages/Agents';
import Transparency from '../pages/Transparency';
import StoreTab from './StoreTab';
import NotebookLM from '../pages/NotebookLM';


const MainLayout: React.FC = () => {
  const { currentUser, subscriptionTier } = useUserStore();
  
  const userName = currentUser?.displayName || 'User';
  const userAvatar = currentUser?.photoURL || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${currentUser?.uid}`;
  const newLogoSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:hsl(213, 90%25, 55%25);' /%3E%3Cstop offset='100%25' style='stop-color:hsl(213, 90%25, 65%25);' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50,5 A45,45 0 1 1 49.9,5 Z' stroke='url(%23g)' stroke-width='8'/%3E%3Cpath d='M35,40 L65,40 M35,60 L65,60 M50,30 V70' stroke='white' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E`;

  return (
    <>
      <div className="flex h-screen bg-background font-sans">
        <aside className="w-[72px] lg:w-64 bg-background border-r border-border p-4 flex flex-col transition-all duration-300">
          <ReactRouterDOM.NavLink to="/dashboard" className="flex items-center justify-center lg:justify-start mb-10 flex-shrink-0">
            <img src={newLogoSvg} alt="Lumina Logo" className="h-10 w-10" />
            <h1 className="font-bold text-2xl ml-3 hidden lg:block text-foreground">Lumina</h1>
          </ReactRouterDOM.NavLink>
          <nav className="flex flex-col space-y-2 flex-grow">
            <NavItem to="/dashboard" icon={<Home size={20}/>} label="Dashboard" />
            <NavItem to="/portfolio" icon={<LayoutGrid size={20}/>} label="Portfolio" />
            <NavItem to="/agents" icon={<Wand2 size={20}/>} label="Agents" />
            <NavItem to="/arena" icon={<Code2 size={20}/>} label="Arena" />
            <NavItem to="/notebooklm" icon={<BookOpen size={20}/>} label="NotebookLM" />
            <NavItem to="/quizzes" icon={<List size={20}/>} label="Quizzes" />
            <NavItem to="/focus" icon={<Sun size={20}/>} label="Focus" />
            <NavItem to="/wellness" icon={<Smile size={20}/>} label="Wellness" />
            <NavItem to="/squads" icon={<Users size={20}/>} label="Squads" />
            <NavItem to="/leaderboard" icon={<BarChart2 size={20}/>} label="Leaderboard" />
          </nav>

          <div className="flex-shrink-0">
             <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
             <NavItem to="/portfolio" className="!p-2 mt-2">
                <div className="flex items-center w-full">
                    <img src={userAvatar} className="w-9 h-9 rounded-full border-2 border-primary" alt="User avatar"/>
                    <div className="ml-3 hidden lg:block overflow-hidden flex-1">
                        <p className="font-semibold text-sm text-foreground truncate">{userName}</p>
                        <PlanBadge tier={subscriptionTier} className="mt-0.5" />
                    </div>
                </div>
            </NavItem>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="dashboard" element={<Dashboard />} />
            <ReactRouterDOM.Route path="portfolio" element={<Portfolio />} />
            <ReactRouterDOM.Route path="agents" element={<Agents />} />
            <ReactRouterDOM.Route path="arena" element={<CodingArena />} />
            <ReactRouterDOM.Route path="notebooklm" element={<NotebookLM />} />
            <ReactRouterDOM.Route path="quizzes" element={<QuizzesList />} />
            <ReactRouterDOM.Route path="quiz/:quizId" element={<QuizView />} />
            <ReactRouterDOM.Route path="focus" element={<Focus />} />
            <ReactRouterDOM.Route path="wellness" element={<Wellness />} />
            <ReactRouterDOM.Route path="squads" element={<SquadsList />} />
            <ReactRouterDOM.Route path="squad/:squadId" element={<SquadView />} />
            <ReactRouterDOM.Route path="leaderboard" element={<Leaderboard />} />
            <ReactRouterDOM.Route path="settings" element={<Settings />}>
              <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="account" replace />} />
              <ReactRouterDOM.Route path="account" element={<AccountTab />} />
              <ReactRouterDOM.Route path="billing" element={<BillingTab />} />
              <ReactRouterDOM.Route path="store" element={<StoreTab />} />
              <ReactRouterDOM.Route path="transparency" element={<Transparency />} />
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route path="/" element={<ReactRouterDOM.Navigate to="/dashboard" replace />} />
            <ReactRouterDOM.Route path="*" element={<ReactRouterDOM.Navigate to="/dashboard" replace />} />
          </ReactRouterDOM.Routes>
        </main>
      </div>
      <SubscriptionGate requiredTier='free'>
          <AIAssistantModal />
      </SubscriptionGate>
      <Toaster 
        position="bottom-right"
        toastOptions={{
            className: '',
            style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
            },
        }}
      />
    </>
  );
};

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, className, children }) => {
  const location = ReactRouterDOM.useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <ReactRouterDOM.NavLink to={to} className={`relative flex items-center p-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 group ${className}`}>
      {isActive && (
          <motion.div
            layoutId="active-nav-pill"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute inset-0 bg-primary rounded-lg"
          />
        )}
      <div className={`relative z-10 flex items-center justify-center lg:justify-start w-full ${isActive ? 'text-primary-foreground' : ''}`}>
        {children || (
          <>
            {icon}
            <span className="ml-4 hidden lg:block font-semibold text-sm">{label}</span>
          </>
        )}
      </div>
    </ReactRouterDOM.NavLink>
  );
};

export default MainLayout;
