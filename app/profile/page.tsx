import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary/10 p-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-background">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-2xl font-semibold text-primary">
                    {session.user.email?.[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <p className="p-2 bg-muted rounded-md">
                  {profile?.full_name || 'Not set'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <p className="p-2 bg-muted rounded-md">{session.user.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <p className="p-2 bg-muted rounded-md capitalize">
                  {profile?.role || 'User'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Edit Profile
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                form="logout-form"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 