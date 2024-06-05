import { Layout } from '@/container';
import { privacyPolicyData, termsAndConditionsData } from '@/static-data';
import React from 'react';

const TermsAndCondition: React.FC = () => (
  <Layout>
    <div className="py-5">
      <h4 className="mb-10 text-center text-xl font-semibold text-primary">
        Termeni și Condiții pentru INTERSPECT
      </h4>
      {termsAndConditionsData?.map((item) => (
        <div className="my-5" key={item?.id}>
          <h6 className="text-sm font-semibold">
            <span className="mr-0.5">{item.id + 1}. </span> {item?.title}
          </h6>
          <p className="mx-3 py-1 text-justify text-sm"> {item?.text} </p>
        </div>
      ))}
      <p className="mx-4 pb-10 text-sm ">
        Acești Termeni și Condiții sunt guvernați de legile din România. Orice
        litigii vor fi soluționate de instanțele competente din România.
      </p>
      {/* <div classNam e="border border-t border-[#00000049]" /> */}
      <h4 className="mb-10 text-center text-xl font-semibold text-primary">
        Politica de Confidențialitate INTERSPECT
      </h4>
      {privacyPolicyData?.map((item) => (
        <div className="my-5" key={item?.id}>
          <h6 className="text-sm font-semibold">
            <span className="mr-0.5">{item.id + 1}. </span> {item?.title}
          </h6>
          <p className="mx-3 py-1 text-justify text-sm"> {item?.text} </p>
        </div>
      ))}
      <p className="mx-4 text-justify text-sm">
        Această Politică de Confidențialitate este guvernată de legile din
        România, în special de Legea nr. 190/2018 privind măsuri de punere în
        aplicare a Regulamentului (UE) 2016/679 și de Legea nr. 506/2004 privind
        prelucrarea datelor cu caracter personal și protecția vieții private în
        sectorul comunicațiilor electronice. Orice litigii vor fi soluționate de
        instanțele competente din România.”
      </p>
    </div>
  </Layout>
);

export default React.memo(TermsAndCondition);
