import * as React from 'react';
import { Form, Formik } from 'formik';
import { IoIosPlay } from 'react-icons/io';
import { Button, SearchSelect, TextField } from '@/components';
import { genderData, locationData } from '@/static-data';
import { Footer, Layout } from '@/container';

interface IProps {}

interface FromValue {
  date: string;
  location: string;
  gender: string;
  studii: string;
}

const Home: React.FC<IProps> = ({}) => {
  const initValues = {
    date: '',
    location: '',
    gender: '',
    studii: '',
  };
  const handleSubmit = (val: FromValue) => {
    console.log('Values', val);
  };
  return (
    <Layout title="Formular">
      <Formik initialValues={initValues} onSubmit={handleSubmit}>
        <Form>
          <TextField name="date" type="date" label="Data nasterii" />
          <SearchSelect
            name="location"
            options={locationData ?? []}
            label="Localitate"
            placeholder="Select"
          />

          <SearchSelect
            name="sex"
            options={genderData ?? []}
            label="Sex"
            placeholder="Select"
          />

          <SearchSelect
            name="studii"
            options={locationData ?? []}
            label="Studii"
            placeholder="Select"
          />
          <Footer>
            <div className="flex items-center gap-3 mt-4 justify-end ">
              <Button
                text="Back"
                type="button"
                variant="outline"
                className="px-4 py-2"
              />
              <Button
                text="Submit"
                type="submit"
                variant="primary"
                icon={<IoIosPlay size={20} color="#fff" />}
                className="px-4 py-2"
                hasIcon
              />
            </div>
          </Footer>
        </Form>
      </Formik>
    </Layout>
  );
};

export default React.memo(Home);
