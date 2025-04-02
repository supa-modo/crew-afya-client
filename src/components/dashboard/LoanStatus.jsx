import React from "react";
import {
  TbWallet,
  TbArrowDown,
  TbCalendarEvent,
  TbCreditCardPay,
} from "react-icons/tb";
import { Link } from "react-router-dom";

const LoanStatus = ({ loans }) => {
  if (!loans || loans.length === 0) {
    return (
      <div className="">
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <TbWallet className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-amber-800 dark:text-white mb-2">
            No Active Loans
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
            You currently don't have any active loans. Apply for a loan to
            access funds for your needs.
          </p>
          <Link
            to="/loans"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium shadow-md hover:bg-purple-700 transition-all"
          >
            View Loan Options
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mt-4 px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
        <h3 className="text-sm sm:text-base font-bold text-amber-800 dark:text-white">
          No Active Loans
        </h3>

        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                   <span>Repayment Progress</span>
                   <span>
                     0%
                   </span>
                 </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{
              width: `${0 * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="mt-2">

  //     <div className="space-y-6">
  //       {loans.map((loan, index) => (
  //         <div
  //           key={index}
  //           className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
  //         >

  //           <div className="p-4">
  //             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
  //               <div>
  //                 <p className="text-xs text-gray-500 dark:text-gray-400">
  //                   Loan Amount
  //                 </p>
  //                 <p className="font-semibold text-gray-800 dark:text-white">
  //                   KSh {loan.amount.toLocaleString()}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p className="text-xs text-gray-500 dark:text-gray-400">
  //                   Current Balance
  //                 </p>
  //                 <p className="font-semibold text-gray-800 dark:text-white">
  //                   KSh {loan.balance.toLocaleString()}
  //                 </p>
  //               </div>
  //               <div>
  //                 <p className="text-xs text-gray-500 dark:text-gray-400">
  //                   Monthly Payment
  //                 </p>
  //                 <p className="font-semibold text-gray-800 dark:text-white">
  //                   KSh {loan.monthlyPayment.toLocaleString()}
  //                 </p>
  //               </div>
  //               <div className="flex items-center">
  //                 <div className="flex-grow">
  //                   <p className="text-xs text-gray-500 dark:text-gray-400">
  //                     Next Payment
  //                   </p>
  //                   <p className="font-semibold text-gray-800 dark:text-white flex items-center">
  //                     <TbCalendarEvent className="h-4 w-4 mr-1 text-gray-500" />
  //                     {loan.nextPayment}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="mb-4">
  //               <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
  //                 <span>Repayment Progress</span>
  //                 <span>
  //                   {Math.round(
  //                     ((loan.amount - loan.balance) / loan.amount) * 100
  //                   )}
  //                   %
  //                 </span>
  //               </div>
  //               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
  //                 <div
  //                   className="bg-purple-600 h-2 rounded-full"
  //                   style={{
  //                     width: `${
  //                       ((loan.amount - loan.balance) / loan.amount) * 100
  //                     }%`,
  //                   }}
  //                 ></div>
  //               </div>
  //             </div>

  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default LoanStatus;
