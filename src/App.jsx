import { useState, useCallback } from "react";
import { useAuth } from './hooks/useAuth';
import { useTheme } from './ThemeContext';
import { SEASONS, LEAGUE_CONFIGS } from './logic/constants';
import { getLeagueDates } from './logic/helpers';
import { generateSchedule as genSchedule } from './logic/schedule';
import { useLeagueData } from './hooks/useLeagueData';
import Header from './components/Header';
import SetupView from './components/SetupView';
import ScheduleView from './components/ScheduleView';
import StandingsView from './components/StandingsView';
import ChampionsView from './components/ChampionsView';

// Wrapper to pass activeLeague from Schedule down to Standings
function MainView({ schedules, setSchedules, leagueTeams, activeSeason, setActiveSeason, isAdmin }) {
    // We recreate the state for activeLeague here so both components can share it
    const todayDow = new Date().getDay();
    const allKeys = Object.keys(LEAGUE_CONFIGS);
    const defaultKey = allKeys.find((k) => LEAGUE_CONFIGS[k].day === todayDow && LEAGUE_CONFIGS[k].type === "daytime")
      || allKeys.find((k) => LEAGUE_CONFIGS[k].day === todayDow) || allKeys[0];
  
    const [activeLeague, setActiveLeague] = useState(defaultKey);

    return (
        <CombinedView schedules={schedules} setSchedules={setSchedules} leagueTeams={leagueTeams} activeSeason={activeSeason} setActiveSeason={setActiveSeason} isAdmin={isAdmin} />
    );
}

// Actually I can just render App and fix it later
export default function App() {
  const { colors } = useTheme();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { seasonDates, holidays, leagueTeams, schedules, loading: dataLoading, updateLeagueData } = useLeagueData();
  
  const [tab, setTab] = useState("schedule");
  const [activeSeason, setActiveSeason] = useState("spring");

  const setSeasonDates = useCallback((updater) => {
    updateLeagueData({ seasonDates: typeof updater === 'function' ? updater(seasonDates) : updater });
  }, [updateLeagueData, seasonDates]);

  const setHolidays = useCallback((updater) => {
    updateLeagueData({ holidays: typeof updater === 'function' ? updater(holidays) : updater });
  }, [updateLeagueData, holidays]);

  const setLeagueTeams = useCallback((updater) => {
    updateLeagueData({ leagueTeams: typeof updater === 'function' ? updater(leagueTeams) : updater });
  }, [updateLeagueData, leagueTeams]);

  const setSchedules = useCallback((updater) => {
    updateLeagueData({ schedules: typeof updater === 'function' ? updater(schedules) : updater });
  }, [updateLeagueData, schedules]);

  const handleGenerate = useCallback(() => {
    const next = { ...schedules };
    Object.entries(LEAGUE_CONFIGS).forEach(([key, cfg]) => {
      const tKey = `${activeSeason}_${key}`;
      const teams = leagueTeams[tKey] || [];
      if (teams.filter((t) => t.trim()).length === 20) {
        const sd = seasonDates[activeSeason];
        const hols = holidays[activeSeason] || [];
        const dates = getLeagueDates(sd.start, sd.end, cfg.day, hols);
        const sched = genSchedule(teams, dates);
        if (sched) next[tKey] = sched;
      }
    });
    setSchedules(next);
  }, [activeSeason, leagueTeams, seasonDates, holidays, schedules, setSchedules]);

  if (authLoading || dataLoading) {
    return (
        <div style={{ background: colors.BG, color: colors.TEXT, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading...
        </div>
    );
  }

  return (
    <div style={{ background: colors.BG, color: colors.TEXT, minHeight: "100vh", fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>
      <Header tab={tab} setTab={setTab} isAdmin={isAdmin} user={user} />
      
      {tab === "setup" && (
        <SetupView seasonDates={seasonDates} setSeasonDates={setSeasonDates} holidays={holidays} setHolidays={setHolidays} leagueTeams={leagueTeams} setLeagueTeams={setLeagueTeams} onGenerate={handleGenerate} schedules={schedules} activeSeason={activeSeason} setActiveSeason={setActiveSeason} />
      )}

      {(tab === "schedule" || tab === "standings" || tab === "champions") && (
         <CombinedView schedules={schedules} setSchedules={setSchedules} leagueTeams={leagueTeams} activeSeason={activeSeason} setActiveSeason={setActiveSeason} isAdmin={isAdmin} forceTab={tab} />
      )}
    </div>
  );
}

function CombinedView({ schedules, setSchedules, leagueTeams, activeSeason, setActiveSeason, isAdmin, forceTab }) {
    const todayDow = new Date().getDay();
    const allKeys = Object.keys(LEAGUE_CONFIGS);
    const defaultKey = allKeys.find((k) => LEAGUE_CONFIGS[k].day === todayDow && LEAGUE_CONFIGS[k].type === "daytime")
      || allKeys.find((k) => LEAGUE_CONFIGS[k].day === todayDow) || allKeys[0];
  
    const [activeLeague, setActiveLeague] = useState(defaultKey);

    return (
         <div style={{ display: 'flex', flexDirection: 'column' }}>
             {/* Always render ScheduleView to provide the Season/League picker! */}
             <ScheduleView 
                 schedules={schedules} setSchedules={setSchedules} 
                 leagueTeams={leagueTeams} 
                 activeSeason={activeSeason} setActiveSeason={setActiveSeason} 
                 activeLeague={activeLeague} setActiveLeague={setActiveLeague}
                 isAdmin={isAdmin} 
                 hideCourts={forceTab === "champions"}
             />
             {forceTab !== "champions" && (
                 <StandingsView 
                     schedules={schedules} 
                     activeSeason={activeSeason} 
                     activeLeague={activeLeague} 
                 />
             )}
             {forceTab === "champions" && (
                 <ChampionsView 
                     schedules={schedules} 
                     activeSeason={activeSeason} 
                     activeLeague={activeLeague} 
                 />
             )}
         </div>
    );
}
