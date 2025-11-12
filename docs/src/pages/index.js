import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          🍇 {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: '🤖 AI-Powered Evaluation',
      description: 'Automated code reviews, test coverage reports, and comprehensive evaluation using open-source AI models with Promptfoo.',
    },
    {
      title: '🔐 Security First',
      description: 'Integrated vulnerability scanning with Trivy, SBOM generation, secrets detection, and automated security reporting.',
    },
    {
      title: '⚡ CI/CD Automation',
      description: 'GitHub Actions workflows for building, testing, evaluating, and deploying with containerized runners.',
    },
    {
      title: '📊 Visual Reports',
      description: 'HTML dashboards with metrics, cost tracking, baseline comparison, and regression detection.',
    },
    {
      title: '📦 Multi-Provider',
      description: 'Support for Ollama, OpenAI, Anthropic, Azure, and Bedrock. Run evaluations locally or in the cloud.',
    },
    {
      title: '🚀 Production Ready',
      description: 'Distroless containers, comprehensive documentation, and automated testing for enterprise deployment.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="AI-powered GitHub automation hub for code evaluation and workflow orchestration">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
