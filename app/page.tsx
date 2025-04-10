'use client';
import { useState, useRef, Key, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Window } from '@/components/ui/Window';
import { Task } from '@/components/task/Task';
import { FeedDialog } from '@/components/chibi/FeedDialog';
import { EditTaskDialog } from '@/components/task/EditTaskDialog';
import { ResetDataDialog } from '@/components/ui/ResetDataDialog';
import { Ghost, Gamepad2, Moon, Settings, LogOut } from 'lucide-react';
import { TabsRoot as Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation/tabs';
import { CHIBI_IMAGES } from '@/lib/utils';
import { Chibi } from '@/components/chibi/Chibi';
import { useChibi } from './hooks/useChibi';
import { useSettings } from '@/hooks/useSettings';
import { useEmojiEffect } from './hooks/useEmojiEffect';
import { DeleteTaskDialog } from '@/components/task/DeleteTaskDialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsDashboard } from '@/components/data/visualization/AnalyticsDashboard';
import { SleepZoneAnalytics } from '@/components/data/visualization/SleepZoneAnalytics';
import { ChibiHealthDisplay } from '@/components/data/visualization/ChibiHealthDisplay';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('chibis');
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);
  
  const {
    chibis,
    currentChibi,
    setCurrentChibiIndex,
    createChibi,
    addTask,
    completeTask,
    feedChibi,
    cleanCompletedTasks,
    deleteTask,
    editTask,
    resetData,
    updateTaskNotes,
    updateTaskDueDate
  } = useChibi();

  const { settings, updateSettings } = useSettings();
  const { emojis, showEmojis } = useEmojiEffect();
  
  // Handle sign out
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      router.push('/login');
    }
  };

  const [showFeedDialog, setShowFeedDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedChibiType, setSelectedChibiType] = useState<keyof typeof CHIBI_IMAGES>('pink');
  const [newChibiName, setNewChibiName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const chibiImageRef = useRef<HTMLDivElement>(null);

  const handleTaskComplete = (taskId: string) => {
    completeTask(taskId);
    setShowFeedDialog(true);
  };

  const handleFeedChibi = () => {
    feedChibi();
    if (chibiImageRef.current) {
      showEmojis(chibiImageRef.current);
    }
  };

  const handleCreateChibi = async () => {
    if (newChibiName.trim()) {
      try {
        await createChibi(newChibiName.trim(), selectedChibiType);
        setNewChibiName('');
        setShowCreateForm(false); // Hide the create form after successful creation
        toast({
          title: 'Success!',
          description: 'Your new chibi has been created!',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create chibi',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  function toggleSoundEffects(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  }

  function toggleNotifications(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  }

  function toggleDarkTheme(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  }

  const createChibiForm = (
    <div className="text-center py-8">
      <p className="font-vt323 text-xl mb-4">{chibis.length === 0 ? 'No Chibis yet!' : 'Create New Chibi'}</p>
      <div className="space-y-4">
        <input
          type="text"
          value={newChibiName}
          onChange={(e) => setNewChibiName(e.target.value)}
          className="w-full px-3 py-2 bg-black text-white font-vt323 text-lg border-2 border-blue-500"
          placeholder="Enter Chibi name..."
        />
        <div className="flex justify-center gap-4">
          {(Object.keys(CHIBI_IMAGES) as Array<keyof typeof CHIBI_IMAGES>).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChibiType(type)}
              className={`w-20 h-20 rounded-lg border-3 overflow-hidden ${
                selectedChibiType === type ? 'border-pink-500 shadow-glow' : 'border-gray-400'
              }`}
            >
              <img src={CHIBI_IMAGES[type]} alt={type} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCreateChibi}
            disabled={!newChibiName.trim()}
            className="bg-gray-200 border-2 border-white border-r-gray-600 border-b-gray-600 px-4 py-2"
          >
            Create New Chibi
          </button>
          {chibis.length > 0 && (
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 border-2 border-white border-r-gray-600 border-b-gray-600 px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chibis">
            <Ghost className="mr-2" />
            Chibis
          </TabsTrigger>
          <TabsTrigger value="awake">
            <Gamepad2 className="mr-2" />
            Awake Zone
          </TabsTrigger>
          <TabsTrigger value="sleep">
            <Moon className="mr-2" />
            Sleep Zone
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chibis" className="mt-6">
          <Window title="CHIBI SELECT" className="mb-6">
            {chibis.length === 0 || showCreateForm ? (
              createChibiForm
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 px-4">
                  <h2 className="font-vt323 text-xl">Your Chibis</h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-neon-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-vt323 flex items-center gap-2"
                  >
                    <span>+ New Chibi</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {chibis.map((chibi, index) => (
                    <div 
                      key={chibi.id}
                      className={`cursor-pointer transition-transform hover:scale-105 ${
                        currentChibi?.id === chibi.id ? 'ring-4 ring-neon-blue rounded-lg' : ''
                      }`}
                      onClick={() => setCurrentChibiIndex(index)}
                    >
                      <Chibi
                        name={chibi.name}
                        image={CHIBI_IMAGES[chibi.type as keyof typeof CHIBI_IMAGES]}
                        happiness={chibi.happiness}
                        energy={chibi.energy}
                        onSelect={() => {
                          setCurrentChibiIndex(index);
                          setActiveTab('awake');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </Window>
        </TabsContent>

        <TabsContent value="awake" className="mt-6">
          {currentChibi ? (
            <Window title={`${currentChibi.name}'s Tasks`} className="mb-6">
              <div className="h-[100vh] flex flex-col">
                {/* Top Half - Health Display */}
                <div className="h-[45vh] flex flex-col space-y-4 p-4 bg-gradient-to-b from-[#000033] to-[#000066]">
                  {/* Chibi Image */}
                  <div ref={chibiImageRef} className="flex-shrink-0">
                    <Chibi
                      name={currentChibi.name}
                      image={currentChibi.image}
                      happiness={currentChibi.happiness}
                      energy={currentChibi.energy}
                    />
                  </div>
                  
                  {/* Health Stats */}
                  <ChibiHealthDisplay chibiId={currentChibi.id} />
                </div>

                {/* Bottom Half - Task List */}
                <div className="flex-1 overflow-auto p-4 bg-[#c3c3c3]">
                  {/* Task List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentChibi.tasks
                      .filter((task: { completed: boolean }) => !task.completed)
                      .map((task) => (
                        <Task
                          key={task.id}
                          {...task}
                          onComplete={() => handleTaskComplete(task.id)}
                          onEdit={() => {
                            setEditingTaskId(task.id);
                            setShowEditDialog(true);
                          }}
                          onDelete={() => {
                            setDeletingTaskId(task.id);
                            setShowDeleteDialog(true);
                          }}
                          onNotesChange={(notes) => updateTaskNotes(task.id, notes)}
                          onDueDateChange={(date) => updateTaskDueDate(task.id, date)}
                        />
                      ))}
                  </div>

                  {/* Add Task Input - Sticky at bottom */}
                  <div className="sticky bottom-0 bg-[#c3c3c3] p-4 -mx-4 mt-6 border-t border-[#ffffff]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                        className="flex-grow px-3 py-2 bg-white border-2 border-[#000080] text-gray-800 font-vt323 text-lg rounded focus:outline-none"
                        placeholder="Add a new task..."
                      />
                      <button
                        onClick={handleAddTask}
                        disabled={!newTaskText.trim()}
                        className="px-4 py-2 bg-[#c3c3c3] text-gray-800 font-vt323 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 hover:bg-[#d4d4d4] transition-colors disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Window>
          ) : (
            <Window title="Select a Chibi" className="mb-6">
              <p className="text-center py-8 font-vt323 text-xl text-[#33ff33]">
                Please select a Chibi first!
              </p>
            </Window>
          )}
        </TabsContent>

        <TabsContent value="sleep" className="mt-6">
          {currentChibi ? (
            <Window title="Task Management" className="mb-6">
              <div className="space-y-6">
                {/* Analytics Charts */}
                <SleepZoneAnalytics chibiId={currentChibi.id} />

                {/* Completed Tasks */}
                <div className="space-y-2">
                  <h3 className="font-vt323 text-lg text-[#33ff33]">Completed Tasks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentChibi.tasks
                      .filter((task: { completed: any; }) => task.completed)
                      .map(task => (
                        <Task
                          key={task.id}
                          {...task}
                          disabled
                          onDelete={() => {
                            setDeletingTaskId(task.id);
                            setShowDeleteDialog(true);
                          }}
                          onNotesChange={(notes) => updateTaskNotes(task.id, notes)}
                          onDueDateChange={(date) => updateTaskDueDate(task.id, date)}
                        />
                      ))}
                  </div>
                </div>

                <button
                  onClick={cleanCompletedTasks}
                  className="w-full px-4 py-2 bg-[#33ff33]/20 text-[#33ff33] font-vt323 border border-[#33ff33]/30 hover:bg-[#33ff33]/30 transition-colors rounded"
                >
                  Clean All Completed
                </button>
              </div>
            </Window>
          ) : (
            <Window title="Select a Chibi" className="mb-6">
              <p className="text-center py-8 font-vt323 text-xl text-[#33ff33]">
                Please select a Chibi first!
              </p>
            </Window>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Window title="Settings.ini" className="mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 bg-black/70 rounded">
                <span className="font-vt323 text-lg">Dark Theme</span>
                <input
                  type="checkbox"
                  checked={settings.darkTheme}
                  onChange={toggleDarkTheme}
                  className="toggle"
                />
              </div>

              <div className="flex justify-between items-center p-2 bg-black/70 rounded">
                <span className="font-vt323 text-lg">Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={toggleNotifications}
                  className="toggle"
                />
              </div>

              <div className="flex justify-between items-center p-2 bg-black/70 rounded">
                <span className="font-vt323 text-lg">Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={toggleSoundEffects}
                  className="toggle"
                />
              </div>

              <button
                onClick={() => setShowResetDialog(true)}
                className="bg-red-500 text-white px-4 py-2 w-full mt-8"
              >
                Reset All Data
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 w-full mt-4"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </Window>
        </TabsContent>
      </Tabs>

      {/* Floating emojis */}
      {emojis.map(({ id, emoji, left, top }) => (
        <div
          key={id}
          className="fixed pointer-events-none animate-float-up z-50"
          style={{ left, top }}
        >
          {emoji}
        </div>
      ))}

      {/* Dialogs */}
      <FeedDialog
        isOpen={showFeedDialog}
        onClose={() => setShowFeedDialog(false)}
        onFeed={handleFeedChibi}
      />

      <EditTaskDialog
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingTaskId(null);
        }}
        onSave={(text) => {
          if (editingTaskId) {
            editTask(editingTaskId, text);
          }
        }}
        initialText={editingTaskId ? currentChibi?.tasks.find(t => t.id === editingTaskId)?.text || '' : ''}
      />

      <DeleteTaskDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingTaskId(null);
        }}
        onConfirm={() => {
          if (deletingTaskId) {
            deleteTask(deletingTaskId);
          }
        }}
      />

      <ResetDataDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={resetData}
      />
    </MainLayout>
  );
}