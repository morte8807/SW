<script>
import ImageHelper from '../../helpers/ImageHelper';

export default {
  props: {
    cardCollection: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  computed: {
    collectionLength() {
      return this.cardCollection ? this.cardCollection.length : 0;
    }
  }
}
</script>
