import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e63030',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoAccent: {
    color: '#e63030',
  },
  date: {
    fontSize: 10,
    color: '#666666',
  },
  hero: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  heroImage: {
    width: 150,
    height: 100,
    objectFit: 'cover',
    borderRadius: 4,
  },
  heroInfo: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carYear: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#e0e0e0',
    padding: '2 6',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  statBoxLast: {
    marginRight: 0,
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#e63030',
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333333',
  },
  issuesList: {
    marginTop: 5,
  },
  issueItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  issueBullet: {
    width: 10,
    fontSize: 12,
    color: '#e63030',
  },
  issueText: {
    fontSize: 12,
    color: '#333333',
    flex: 1,
  },
  verdictContainer: {
    marginTop: 'auto',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  verdictLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  verdictValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buy: { color: '#00c853' },
  avoid: { color: '#d32f2f' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
});

const formatPrice = (price) => {
  return price 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(price).replace(/\u202f/g, ' ') 
    : 'N/A';
};

const PdfReport = ({ report, imageUrl }) => {
  if (!report) return null;
  const isBuy = report.recommendation?.toUpperCase() === 'BUY';
  const validYear = report.year && report.year.toLowerCase() !== 'unknown';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Text style={styles.logo}>CarScan<Text style={styles.logoAccent}>.ma</Text></Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.hero}>
          <Image src={imageUrl} style={styles.heroImage} />
          <View style={styles.heroInfo}>
            <Text style={styles.carName}>{report.make} {report.model}</Text>
            {validYear && <Text style={styles.carYear}>{report.year}</Text>}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Condition Score</Text>
            <Text style={styles.statValue}>{report.condition_score} / 10</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxLast]}>
            <Text style={styles.statLabel}>Estimated Price</Text>
            <Text style={styles.statValue}>{formatPrice(report.estimated_price_mad)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Summary</Text>
          <Text style={styles.summaryText}>{report.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Issues</Text>
          <View style={styles.issuesList}>
            {report.detected_issues && report.detected_issues.length > 0 ? (
              report.detected_issues.map((issue, idx) => (
                <View key={idx} style={styles.issueItem}>
                  <Text style={styles.issueBullet}>•</Text>
                  <Text style={styles.issueText}>{issue}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.summaryText}>No significant issues detected.</Text>
            )}
          </View>
        </View>

        <View style={styles.verdictContainer}>
          <Text style={styles.verdictLabel}>AI RECOMMENDATION</Text>
          <Text style={[styles.verdictValue, isBuy ? styles.buy : styles.avoid]}>
            {isBuy ? 'BUY THIS CAR' : 'AVOID THIS CAR'}
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          This report is generated by CarScan.ma AI based on exterior visual analysis only. 
          Physical inspection of engine, transmission, interior, and electrical systems is required before purchase.
        </Text>
        
      </Page>
    </Document>
  );
};

export default PdfReport;
