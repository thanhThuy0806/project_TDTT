import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../../constants/colors";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  greeting: { marginTop: 30 },
  hiText: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  welcomeText: { fontSize: 16, color: '#888', marginTop: 4 },
  searchSection: { marginTop: 25 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    alignItems: 'center',
    paddingLeft: 20,
    height: 56,
  },
  searchInput: { flex: 1, fontSize: 16 },
  searchBtn: { padding: 12, backgroundColor: '#FFF', borderRadius: 15, margin: 6 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 8, borderRadius: 15 },
  addBtnText: { color: '#059669', fontWeight: 'bold', marginRight: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});