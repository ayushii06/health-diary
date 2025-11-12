import Image from "next/image";
import React from "react";
import healthy1 from "../../../public/healthy1.png";
import healthy2 from "../../../public/healthy2.png";
import healthy3 from "../../../public/healthy3.png";
import healthy4 from "../../../public/healthy4.png";
import healthy5 from "../../../public/healthy5.png";
import unhealty1 from "../../../public/unhealthy1.png";
import unhealty2 from "../../../public/unhealthy2.png";
import unhealty3 from "../../../public/unhealthy3.png";

function About() {
  return (
    <>
      <div className="text-center py-8">
        <h1 className="font-bold mt-30 mb-12 text-2xl ">Blood Sugar Level</h1>
        <div className="max-w-5xl mx-auto font-light text-gray-600">
          Blood sugar (or blood glucose) refers to the amount of glucose present
          in your bloodstream.Glucose comes mainly from the food you eat —
          especially carbohydrates — and is the primary source of energy for
          your body’s cells. Your body regulates blood sugar using insulin, a
          hormone produced by the pancreas.
          <div className="text-start mt-4">
            <li className="list-disc">
              When blood sugar rises (after eating), insulin helps cells absorb
              glucose.
            </li>
            <li className="list-disc">
              When blood sugar drops (during fasting), another hormone called
              glucagon helps release glucose from stored sources like the liver.
            </li>
          </div>
        </div>
        <table className="w-[70%] mx-auto border-2 mb-4 text-left rounded-2xl border-gray-700 mt-12">
          <thead>
            <tr>
              <th className="border-b-2 border-r-2 border-gray-700 p-4">
                Measurement
              </th>
              <th className="border-b-2 border-r-2 border-gray-700 p-4">
                Fasting (mg/dL)
              </th>
              <th className="border-b-2 border-r-2 border-gray-700 p-4">
                2hrs After-Meal (mg/dL)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-r border-gray-500 p-4">Normal</td>
              <td className="border-b border-r border-gray-500 p-4">70-99</td>
              <td className="border-b border-r border-gray-500 p-4">
                Less than 140
              </td>
            </tr>
            <tr>
              <td className="border-b border-r border-gray-500 p-4">
                Prediabetes
              </td>
              <td className="border-b border-r border-gray-500 p-4">100-125</td>
              <td className="border-b border-r border-gray-500 p-4">140-199</td>
            </tr>
            <tr>
              <td className="border-b border-r border-gray-500 p-4">
                Diabetes
              </td>
              <td className="border-b border-r border-gray-500 p-4">
                126 or higher
              </td>
              <td className="border-b border-r border-gray-500 p-4">
                200 or higher
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-light text-gray-600">
          * Fasting = after 8 hours without food
        </p>
      </div>

      <div className="flex justify-center items-start gap-20 my-12 mx-12">
        <div className="border-2 border-gray-700  p-6 ">
          <p className="text-center font-bold text-lg">High blood sugar</p>
          <div className="bg-blue-600 text-white py-2 px-4 rounded-4xl w-fit">
            Causes
          </div>
          <ul className="ml-6 text-wrap my-6 list-decimal text-md font-normal">
            <li>Skipping meals</li>
            <li>Eating high-carb meals</li>
            <li>Stress</li>
            <li>
              Low insulin production or insulin resistance (as in diabetes)
            </li>
            <li>Stress, illness, or lack of exercise</li>
          </ul>

          <div className="bg-blue-600 text-white py-2 px-4 rounded-4xl w-fit">
            Symptoms
          </div>
          <ul className="ml-6 text-wrap my-6 list-decimal text-md font-normal">
            <li>Increased thirst and urination</li>
            <li>Fatigue</li>
            <li>Blurred vision</li>
            <li>Headaches</li>
            <li>Slow-healing wounds</li>
          </ul>
        </div>
        <div className="border-2 border-gray-700  p-6 ">
          <p className="text-center font-bold text-lg">Low blood sugar level</p>
          <p className="bg-blue-600 text-white py-2 px-4 rounded-4xl w-fit">
            Causes
          </p>
          <ul className="ml-6 text-wrap my-6 list-decimal text-md font-normal">
            <li>Excessive insulin or diabetes medications</li>
            <li>Skipping meals or eating less than usual</li>
            <li>
              Increased physical activity without adjusting food or medication
            </li>
            <li>Alcohol consumption, especially on an empty stomach</li>
          </ul>
          <div className="bg-blue-600 text-white py-2 px-4 rounded-4xl w-fit">
            Symptoms
          </div>
          <ul className="ml-6 text-wrap my-6 list-decimal text-md font-normal">
            <li>Shakiness or trembling</li>
            <li>Sweating</li>
            <li>Hunger</li>
            <li>Dizziness or lightheadedness</li>
            <li>Confusion or irritability</li>
          </ul>
        </div>
      </div>

      <div className="font-bold text-center mt-30 my-12 text-3xl">
        Food To Eat
      </div>
      <div className="flex justify-evenly items-start gap-10 my-12 mx-12 ">
        <div className="w-[300px]">
          <Image
            src={healthy1}
            className=""
            width={300}
            height={200}
            alt="healthy food"
          />
          <p className="">
            Palak, Methi, Bathua, Lauki, Tinda, Tori, Bhindi, Beans, Broccoli,
            Cabbage, Cauliflower, Carrot, Beetroot
          </p>
        </div>
        <div className="w-[300px]">
          <Image
            src={healthy2}
            className=""
            width={300}
            height={200}
            alt="healthy food"
          />
          <p className="">
            Brown rice, Daliya, Jowar, Bajra, Ragi, Oats, whole wheat, ragi
            flour
          </p>
        </div>
        <div className="w-[300px]">
          <Image
            src={healthy3}
            className=""
            width={300}
            height={200}
            alt="healthy food"
          />
          <p className="">
            Dal, Rajma, Chana, Moong, Sprouts, Tofu, Paneer, Eggs, Chicken, Fish
          </p>
        </div>
        <div className="w-[300px]">
          <Image
            src={healthy4}
            className=""
            width={300}
            height={200}
            alt="healthy food"
          />
          <p className="">Almonds, Walnuts, Flaxseeds, Chia seeds</p>
        </div>
        <div className="w-[300px]">
          <Image
            src={healthy5}
            className=""
            width={300}
            height={200}
            alt="healthy food"
          />
          <p className="">
            Apple, Guava, Papaya, Orange, Pear, Jamun, Strawberries, Pomegranate
          </p>
        </div>
      </div>

      <div className="font-bold text-center mt-30 text-3xl">Foods To Avoid</div>
      <div className="flex justify-evenly items-start gap-10 py-12 mx-12 ">
        <div className="w-[300px] mx-auto mb-8">
          <Image
            src={unhealty2}
            className="mx-auto"
            width={400}
            height={200}
            alt="unhealthy food"
          />
          <p className="">Samosa, pakora, chips, puri, bhatura, Maida</p>
        </div>
        <div className="w-[300px] mx-auto mb-8">
          <Image
            src={unhealty1}
            className="mx-auto"
            width={400}
            height={200}
            alt="unhealthy food"
          />
          <p className="">
            Processed Foods (Pizza, Burger, etc.), Soft Drinks (Pepsi,
            Coca-Cola), Fast Food
          </p>
        </div>
        <div className="w-[300px] mx-auto mb-8">
          <Image
            src={unhealty3}
            className="mx-auto"
            width={400}
            height={200}
            alt="unhealthy food"
          />
          <p className="">
            Sweets, mithai, cakes, Sweet fruits (Mango, Banana)
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
