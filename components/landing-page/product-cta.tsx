import React from 'react'
import { Button } from '../ui/button'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'

export default function ProductCta() {
  return (
    <section className="group w-full px-4 py-32 bg-white">
      <div className='max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-32 md:gap-0 w-full bg-zinc-100 p-12 rounded-2xl'>
        <div className='flex flex-col justify-between w-fit gap-10'>
          <div className='space-y-4'>
            <h2 className="text-5xl font-bold text-gray-900">
              Best <span className='text-blue-500'>Sneakers</span> 
              <br />
              Collections
              For You
            </h2>
            <p className='max-w-md text-muted-foreground'>
              Explore the latest sneaker releases, limited editions, and collaborations. Discover new styles, trends,
            </p>
          </div>
          <Button size={"lg"} className='w-fit'>
            <ShoppingBag/> Shop Now
          </Button>
        </div>
        <div>
          <Image
            src={"/cta.png"}
            alt="Hoodie"
            width={500}
            height={500}
            className='rounded-xl w-full group-hover:animate-wiggle transition-all ease-in duration-1000'
          />
        </div>
      </div>
    </section>
  )
}
