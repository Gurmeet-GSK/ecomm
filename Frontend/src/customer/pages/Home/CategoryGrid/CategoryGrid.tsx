
const CategoryGrid = () => {
  return (
    <div className='grid gap-4 grid-rows-12 grid-cols-12 lg:h-150 px-5 lg:px-20'>
        <div className='col-span-3 row-span-12 text-white '>
            <img 
            className="w-full h-full object-cover object-top rounded-md"
            src="https://i.pinimg.com/736x/ba/e0/ef/bae0efe20c8c5b79f8f0039698a1dc4f.jpg" alt="" />
        </div>
        <div className='col-span-2 row-span-6 text-white '>
            <img 
            className="w-full h-full object-cover object-top rounded-md"
            src="https://i.pinimg.com/736x/23/73/4e/23734e7e6020754e22eebb6fce6adff7.jpg"alt="" />
        </div>
        <div className='col-span-4 row-span-6 text-white '>
            <img 
            className="w-full h-full object-cover object-top rounded-md"
            src="https://i.pinimg.com/736x/8a/4d/d9/8a4dd9e8cd415677032b009fbe779055.jpg"alt="" />
        </div>

        <div className='col-span-3 row-span-12 text-white '>
            <img 
            className="w-full h-full object-cover object-top rounded-md"
            src="https://i.pinimg.com/1200x/a1/af/ce/a1afce3a8c53a63387d9714ab2523e95.jpg"alt="" />
        </div>

        <div className='col-span-4 row-span-6 text-white '>
            <img 
            className="w-full h-full object-cover object-top rounded-md"
            src="https://i.pinimg.com/1200x/fc/f0/b9/fcf0b9fcdea290705fd677934707166c.jpg"alt="" />
        </div>

        <div className='col-span-2 row-span-6 text-white '>
            <img 
            className="w-full h-full object-cover object-top rounded-md "
            src="https://i.pinimg.com/736x/8d/bd/7d/8dbd7d1a76a0a569ac4fa71933b669a1.jpg"alt="" />
        </div>
    </div>
  )
}

export default CategoryGrid