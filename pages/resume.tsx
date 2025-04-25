/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

/* -------------------------- Internal Dependencies ------------------------- */

import Layout, { PageWrapper } from '../components/Layout';

const Resume = () => {

  return (
    <Layout title="Resume">
      <PageWrapper>
        <PageSection>
          <article>
            <h1 className="intro__text">Resumé.</h1>
            <p>
              All infos to Reach out to me are on my resume.{' '}
              .{' '}
              <br/>
              <b>
                <a
                  href={`https://drive.google.com/file/d/1iOX3hxRLtRBrIPtAGAgsVNr0sr28Dsc8/view?usp=sharing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Go to Resumé Page"
                >
                  view
                </a>
              </b>{' '}
              or{' '}
              <b>
                <a
                  href={`https://drive.google.com/file/d/1iOX3hxRLtRBrIPtAGAgsVNr0sr28Dsc8/view?usp=sharing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Go to Resumé Page"
                >
                  download
                </a>
              </b>{' '}
              the resume{' '}
            </p>
          </article>
          <br />
        </PageSection>
      </PageWrapper>
    </Layout>
  );
};

const PageSection = styled.div`
  .intro__text {
    font-size: var(--font-x-lg);
    font-weight: 900;
    margin: 4rem 0rem 1.5rem;
    position: relative;
  }
  p {
    font-size: calc(var(--font-sm) + 0.9px);
    margin-top: 0.6rem;
    line-height: 2;
    font-weight: 400;
    color: var(--article-color) !important;
  }
  iframe {
    width: 100%;
    filter: invert(var(--invert)) grayscale(calc(var(--invert) - 0.15));
    border: none;
    height: 44.5rem;
    @media (min-width: 768px) {
      width: 82.8% !important;
      height: 70.4rem !important;
    }
  }
`;
export default Resume;
