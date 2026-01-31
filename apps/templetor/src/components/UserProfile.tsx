/**
 * UserProfile - Example with nested conditions
 */

import { Var, If, Else, ElseIf, Slot } from '@ui8kit/template';

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    avatar?: string;
  };
  isLoggedIn?: boolean;
  children?: React.ReactNode;
}

export function UserProfile({ user, isLoggedIn, children }: UserProfileProps) {
  return (
    <div className="user-profile bg-white rounded-lg shadow p-6">
      <If test="isLoggedIn">
        <div className="flex items-center gap-4">
          <If test="user.avatar">
            <img
              className="w-16 h-16 rounded-full"
              src="{{user.avatar}}"
              alt="Avatar"
            />
          </If>
          <Else>
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl"><Var>user.name[0]</Var></span>
            </div>
          </Else>
          
          <div>
            <h2 className="text-xl font-bold"><Var>user.name</Var></h2>
            <p className="text-gray-500"><Var>user.email</Var></p>
            
            <If test="user.role === 'admin'">
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Admin
              </span>
            </If>
            <ElseIf test="user.role === 'user'">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                User
              </span>
            </ElseIf>
            <Else>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                Guest
              </span>
            </Else>
          </div>
        </div>
        
        <Slot name="actions">
          {children}
        </Slot>
      </If>
      
      <Else>
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to view your profile</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Log In
          </button>
        </div>
      </Else>
    </div>
  );
}
