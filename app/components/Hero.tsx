import React from 'react'
import { Input } from './ui/input'
import { Select, SelectItem, SelectListBox, SelectPopover, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import NavbarDemo from './common/Navbar'

const dropdownOptions = [
      { value: 'fasting', label: 'Fasting' },
      { value: 'before_breakfast', label: 'Before Breakfast' },
      { value: 'after_breakfast', label: 'After Breakfast' },
      { value: 'before_lunch', label: 'Before Lunch' },
      { value: 'after_lunch', label: 'After Lunch' },
      { value: 'before_dinner', label: 'Before Dinner' },
      { value: 'after_dinner', label: 'After Dinner' },
      { value: 'bedtime', label: 'Bedtime' },
      { value: 'random', label: 'Random' },
      { value: 'afternoon', label: 'Afternoon' },
]

function Hero() {
  return (
    <>
    <NavbarDemo/>
    {/* user is registered */}
    <div className="text-center pt-10">

      <p className="text-4xl font-bold my-8">Hi, Please enter your blood sugar level</p>
      <form className="w-[45%] border border-gray-500 rounded-3xl px-6 py-4 text-start mx-auto  space-y-8">
           <div className="space-y-2 ">
        <h3 className="text-md font-bold ">Enter your readings</h3>
        <Input 
      
          placeholder="Type reading..." 
        />
      </div>
{/* 
      <div className="space-y-2">
        <h3 className="text-sm font-medium"></h3>
        <Input 
          label="Label" 
          placeholder="Type something..." 
          error="This field is required"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Success State</h3>
        <Input 
          label="Label" 
          placeholder="Type something..." 
          success="Looks good!"
          defaultValue="Valid input"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">With Clear Button</h3>
        <Input 
          label="Label" 
          placeholder="Type something..." 
          defaultValue="Clearable input"
          onClear={() => console.log('Input cleared')}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Disabled</h3>
        <Input 
          label="Label" 
          placeholder="Type something..." 
          disabled
          defaultValue="Disabled input"
        />
      </div> */}

      <div className="space-y-2 w-full" >
            <h3 className="text-md font-bold">Enter the time of the day</h3>
            
            
    <Select className="" placeholder="Select a time">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectPopover>
        <SelectListBox>
          {dropdownOptions.map((option)=>{
            return <SelectItem key={option.value}>{option.label}</SelectItem>
            
          })}
        </SelectListBox>
      </SelectPopover>
    </Select>

      </div>
      <div className="text-center">
      <Button >Record It</Button>

      </div>

      </form>
    </div>
{/* 
      Keep Track of your blood sugar levels easily
      <button className="">Start Recording </button> */}
    </>

  )
}

export default Hero