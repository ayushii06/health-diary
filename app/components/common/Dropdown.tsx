import React from 'react'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type DropdownProps = {
  email: string | null | undefined;
};

function Dropdown({email}:DropdownProps) {

  const router = useRouter()

    const handleDeleteAccount = async () => {
      console.log("clicked")
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmed) return;
  
    const res = await fetch('/api/delete-account', { method: 'DELETE' });
  
    if (res.ok) {
      // Sign out user and redirect
      await signOut({ callbackUrl: '/' });
    } else {
      const data = await res.json();
      alert(`Failed to delete account: ${data.error}`);
    }
  };
  

  return (
    <div className='absolute z-100 top-20 right-3 bg-neutral-900 rounded-lg border border-gray-600 text-white text-sm '>
      <div className="my-4 px-4">{email}</div>
      <hr className='text-gray-600 '/>
      <div className="">
        <p className="px-4 py-2 cursor-pointer hover:bg-neutral-800 "  onClick={()=>{router.push('/legal/terms-of-service')}}>Terms and Conditions</p>
        <p className="px-4 py-2 cursor-pointer hover:bg-neutral-800 "  onClick={()=>{router.push('/legal/privacy-policy')}}>Privacy Policy</p>
      </div>
      <hr className='text-gray-600'/>
      <div className=" cursor-pointer py-2 px-4 text-red-500 hover:bg-neutral-800 " onClick={() => signOut({ callbackUrl: "/" })}>
        Sign Out
      </div>
      <div className=" cursor-pointer py-2 px-4 text-red-500 hover:bg-neutral-800 " onClick={handleDeleteAccount}>
       Delete Account
      </div>
    </div>
  )
}

export default Dropdown