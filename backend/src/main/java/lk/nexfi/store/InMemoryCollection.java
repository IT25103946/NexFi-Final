package lk.nexfi.store;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import lk.nexfi.domain.Identifiable;

/**
 * Small thread-safe in-memory table used as a temporary stand-in for a database.
 * Data lives for as long as the application runs.
 */
public class InMemoryCollection<T extends Identifiable> {

    private final List<T> items = new ArrayList<>();
    private final AtomicLong sequence = new AtomicLong(0);

    public synchronized List<T> findAll() {
        return new ArrayList<>(items);
    }

    public synchronized Optional<T> findById(long id) {
        return items.stream().filter(item -> item.getId().equals(id)).findFirst();
    }

    public synchronized T save(T item) {
        if (item.getId() == null) {
            item.setId(sequence.incrementAndGet());
            items.add(item);
            return item;
        }
        T existing = findOrThrow(item.getId());
        int index = items.indexOf(existing);
        items.set(index, item);
        return item;
    }

    public synchronized void delete(long id) {
        T existing = findOrThrow(id);
        items.remove(existing);
    }

    public synchronized boolean isEmpty() {
        return items.isEmpty();
    }

    public synchronized void clear() {
        items.clear();
        sequence.set(0);
    }

    public synchronized List<T> sorted(Comparator<? super T> comparator) {
        List<T> copy = new ArrayList<>(items);
        copy.sort(comparator);
        return copy;
    }

    private T findOrThrow(long id) {
        return findById(id).orElseThrow(() -> new NoSuchElementException("Record " + id + " was not found"));
    }
}
